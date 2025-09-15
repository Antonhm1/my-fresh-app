#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import puppeteer from 'puppeteer'
import { ui } from './claude-ui-workflow.js'

class PuppeteerMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'puppeteer-ui-tester',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    )

    this.browser = null
    this.page = null
    this.setupToolHandlers()

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error)
    process.on('SIGINT', async () => {
      await this.cleanup()
      process.exit(0)
    })
  }

  async cleanup() {
    if (this.page) {
      await this.page.close()
    }
    if (this.browser) {
      await this.browser.close()
    }
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'launch_browser',
          description: 'Launch a new browser instance',
          inputSchema: {
            type: 'object',
            properties: {
              headless: {
                type: 'boolean',
                description: 'Run browser in headless mode',
                default: false,
              },
              url: {
                type: 'string',
                description: 'Initial URL to navigate to',
                default: 'http://localhost:5173',
              },
            },
          },
        },
        {
          name: 'navigate',
          description: 'Navigate to a URL',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to navigate to',
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'click_element',
          description: 'Click on an element',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector or data-testid',
              },
              waitFor: {
                type: 'number',
                description: 'Milliseconds to wait after click',
                default: 1000,
              },
            },
            required: ['selector'],
          },
        },
        {
          name: 'fill_input',
          description: 'Fill an input field',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector for the input field',
              },
              value: {
                type: 'string',
                description: 'Value to fill',
              },
            },
            required: ['selector', 'value'],
          },
        },
        {
          name: 'take_screenshot',
          description: 'Take a screenshot of the current page',
          inputSchema: {
            type: 'object',
            properties: {
              filename: {
                type: 'string',
                description: 'Filename for the screenshot',
                default: 'screenshot.png',
              },
              fullPage: {
                type: 'boolean',
                description: 'Capture full page',
                default: true,
              },
            },
          },
        },
        {
          name: 'get_text',
          description: 'Get text content from an element',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector',
              },
            },
            required: ['selector'],
          },
        },
        {
          name: 'wait_for_element',
          description: 'Wait for an element to appear',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector to wait for',
              },
              timeout: {
                type: 'number',
                description: 'Timeout in milliseconds',
                default: 5000,
              },
            },
            required: ['selector'],
          },
        },
        {
          name: 'evaluate_script',
          description: 'Execute JavaScript in the browser',
          inputSchema: {
            type: 'object',
            properties: {
              script: {
                type: 'string',
                description: 'JavaScript code to execute',
              },
            },
            required: ['script'],
          },
        },
        {
          name: 'get_page_info',
          description: 'Get current page information',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'close_browser',
          description: 'Close the browser',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'start_ui_workflow',
          description: 'Start automated UI testing workflow for iterative development',
          inputSchema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
                description: 'Description of the UI development session',
                default: 'UI development session',
              },
            },
          },
        },
        {
          name: 'test_ui_change',
          description: 'Test UI after making changes and get validation feedback',
          inputSchema: {
            type: 'object',
            properties: {
              changeDescription: {
                type: 'string',
                description: 'Description of the changes made',
              },
            },
            required: ['changeDescription'],
          },
        },
        {
          name: 'iterate_component',
          description: 'Iteratively test a specific component with automated feedback',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: {
                type: 'string',
                description: 'Name of the component to iterate on (e.g., EventCard, BannerSystem)',
              },
              expectedFeatures: {
                type: 'array',
                description: 'Expected features to test for',
                items: {
                  type: 'object',
                  properties: {
                    selector: { type: 'string' },
                    description: { type: 'string' },
                    shouldExist: { type: 'boolean', default: true },
                  },
                },
                default: [],
              },
            },
            required: ['componentName'],
          },
        },
        {
          name: 'quick_ui_check',
          description: 'Quick validation of current UI state',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'end_ui_workflow',
          description: 'End the UI testing workflow and generate report',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'ui_workflow_status',
          description: 'Get status of the current UI workflow',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }))

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      try {
        switch (name) {
          case 'launch_browser':
            return await this.launchBrowser(args)
          case 'navigate':
            return await this.navigate(args)
          case 'click_element':
            return await this.clickElement(args)
          case 'fill_input':
            return await this.fillInput(args)
          case 'take_screenshot':
            return await this.takeScreenshot(args)
          case 'get_text':
            return await this.getText(args)
          case 'wait_for_element':
            return await this.waitForElement(args)
          case 'evaluate_script':
            return await this.evaluateScript(args)
          case 'get_page_info':
            return await this.getPageInfo()
          case 'close_browser':
            return await this.closeBrowser()
          case 'start_ui_workflow':
            return await this.startUIWorkflow(args)
          case 'test_ui_change':
            return await this.testUIChange(args)
          case 'iterate_component':
            return await this.iterateComponent(args)
          case 'quick_ui_check':
            return await this.quickUICheck()
          case 'end_ui_workflow':
            return await this.endUIWorkflow()
          case 'ui_workflow_status':
            return await this.getUIWorkflowStatus()
          default:
            throw new Error(`Unknown tool: ${name}`)
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        }
      }
    })
  }

  async launchBrowser(args = {}) {
    const { headless = false, url = 'http://localhost:5173' } = args

    if (this.browser) {
      await this.browser.close()
    }

    this.browser = await puppeteer.launch({
      headless,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    this.page = await this.browser.newPage()
    await this.page.goto(url)

    return {
      content: [
        {
          type: 'text',
          text: `Browser launched ${headless ? '(headless)' : '(visible)'} and navigated to ${url}`,
        },
      ],
    }
  }

  async navigate(args) {
    if (!this.page) {
      throw new Error('Browser not launched. Use launch_browser first.')
    }

    await this.page.goto(args.url)
    return {
      content: [
        {
          type: 'text',
          text: `Navigated to ${args.url}`,
        },
      ],
    }
  }

  async clickElement(args) {
    if (!this.page) {
      throw new Error('Browser not launched. Use launch_browser first.')
    }

    const { selector, waitFor = 1000 } = args

    // Try different selector strategies
    let element
    if (selector.startsWith('[data-testid=')) {
      element = await this.page.$(selector)
    } else if (selector.startsWith('text=')) {
      const text = selector.replace('text=', '')
      element = await this.page.$(`text=${text}`)
    } else {
      element = await this.page.$(selector)
    }

    if (!element) {
      throw new Error(`Element not found: ${selector}`)
    }

    await element.click()
    await this.page.waitForTimeout(waitFor)

    return {
      content: [
        {
          type: 'text',
          text: `Clicked element: ${selector}`,
        },
      ],
    }
  }

  async fillInput(args) {
    if (!this.page) {
      throw new Error('Browser not launched. Use launch_browser first.')
    }

    const { selector, value } = args
    await this.page.fill(selector, value)

    return {
      content: [
        {
          type: 'text',
          text: `Filled input ${selector} with: ${value}`,
        },
      ],
    }
  }

  async takeScreenshot(args = {}) {
    if (!this.page) {
      throw new Error('Browser not launched. Use launch_browser first.')
    }

    const { filename = 'screenshot.png', fullPage = true } = args
    const screenshotPath = `./screenshots/${filename}`

    // Create screenshots directory if it doesn't exist
    await this.page.evaluate(() => {
      const fs = require('fs')
      if (!fs.existsSync('./screenshots')) {
        fs.mkdirSync('./screenshots', { recursive: true })
      }
    })

    await this.page.screenshot({
      path: screenshotPath,
      fullPage,
    })

    return {
      content: [
        {
          type: 'text',
          text: `Screenshot saved: ${screenshotPath}`,
        },
      ],
    }
  }

  async getText(args) {
    if (!this.page) {
      throw new Error('Browser not launched. Use launch_browser first.')
    }

    const { selector } = args
    const text = await this.page.$eval(selector, (el) => el.textContent)

    return {
      content: [
        {
          type: 'text',
          text: `Text from ${selector}: ${text}`,
        },
      ],
    }
  }

  async waitForElement(args) {
    if (!this.page) {
      throw new Error('Browser not launched. Use launch_browser first.')
    }

    const { selector, timeout = 5000 } = args
    await this.page.waitForSelector(selector, { timeout })

    return {
      content: [
        {
          type: 'text',
          text: `Element appeared: ${selector}`,
        },
      ],
    }
  }

  async evaluateScript(args) {
    if (!this.page) {
      throw new Error('Browser not launched. Use launch_browser first.')
    }

    const { script } = args
    const result = await this.page.evaluate(script)

    return {
      content: [
        {
          type: 'text',
          text: `Script result: ${JSON.stringify(result)}`,
        },
      ],
    }
  }

  async getPageInfo() {
    if (!this.page) {
      throw new Error('Browser not launched. Use launch_browser first.')
    }

    const url = this.page.url()
    const title = await this.page.title()

    return {
      content: [
        {
          type: 'text',
          text: `Page Info:\nURL: ${url}\nTitle: ${title}`,
        },
      ],
    }
  }

  async closeBrowser() {
    await this.cleanup()
    return {
      content: [
        {
          type: 'text',
          text: 'Browser closed',
        },
      ],
    }
  }

  // UI Workflow Methods
  async startUIWorkflow(args = {}) {
    const { description = 'UI development session' } = args

    try {
      const result = await ui.start(description)

      return {
        content: [
          {
            type: 'text',
            text: `🚀 UI Workflow started: ${description}\n\nInitial test results:\n- Total tests: ${result.initialReport.totalTests}\n- Passed: ${result.initialReport.passedTests}\n- Failed: ${result.initialReport.failedTests}\n\nReady for iterative development!`,
          },
        ],
      }
    } catch (error) {
      throw new Error(`Failed to start UI workflow: ${error.message}`)
    }
  }

  async testUIChange(args) {
    const { changeDescription } = args

    try {
      const result = await ui.test(changeDescription)

      const statusText = result.allTestsPassed ? '✅ All tests passed!' : '❌ Some tests failed'
      const recommendations = result.recommendations.join('\n')

      return {
        content: [
          {
            type: 'text',
            text: `🔄 Tested UI change: ${changeDescription}\n\n${statusText}\n\nValidation Results:\n${result.validationResults.map(r => `${r.passed ? '✅' : '❌'} ${r.description}`).join('\n')}\n\nRecommendations:\n${recommendations}`,
          },
        ],
      }
    } catch (error) {
      throw new Error(`Failed to test UI change: ${error.message}`)
    }
  }

  async iterateComponent(args) {
    const { componentName, expectedFeatures = [] } = args

    try {
      const result = await ui.iterate(componentName, expectedFeatures)

      const nextStepsText = result.nextSteps.length > 0 ?
        `\n\nNext Steps:\n${result.nextSteps.join('\n')}` : ''

      return {
        content: [
          {
            type: 'text',
            text: `🔄 Component iteration: ${componentName}\n\n- Iterations completed: ${result.iterations}\n- Status: ${result.completed ? 'Completed' : 'Needs more work'}\n\nComponent testing results captured with screenshots.${nextStepsText}`,
          },
        ],
      }
    } catch (error) {
      throw new Error(`Failed to iterate component: ${error.message}`)
    }
  }

  async quickUICheck() {
    try {
      const result = await ui.quickCheck()

      return {
        content: [
          {
            type: 'text',
            text: `🧪 Quick UI Check completed\n\n- Total tests: ${result.totalTests}\n- Passed: ${result.passedTests}\n- Failed: ${result.failedTests}\n- Screenshots: ${result.screenshots}\n\nScreenshot saved for current UI state.`,
          },
        ],
      }
    } catch (error) {
      throw new Error(`Failed to perform quick UI check: ${error.message}`)
    }
  }

  async endUIWorkflow() {
    try {
      const result = await ui.end()

      return {
        content: [
          {
            type: 'text',
            text: `🏁 UI Workflow ended\n\nSession Summary:\n- Total sessions: ${result.report.totalSessions}\n- Average tests per session: ${result.report.averageTests.toFixed(1)}\n- Success rate: ${(result.report.successRate * 100).toFixed(1)}%\n\nWorkflow report generated and saved.`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: 'UI Workflow ended (no active session)',
          },
        ],
      }
    }
  }

  async getUIWorkflowStatus() {
    const status = ui.status()

    return {
      content: [
        {
          type: 'text',
          text: `📊 UI Workflow Status\n\n- Active: ${status.isActive ? 'Yes' : 'No'}\n- Current component: ${status.currentComponent || 'None'}\n- Workflow ready: ${status.hasWorkflow ? 'Yes' : 'No'}`,
        },
      ],
    }
  }

  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('Puppeteer MCP server running on stdio')
  }
}

const server = new PuppeteerMCPServer()
server.run().catch(console.error)