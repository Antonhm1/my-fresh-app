#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import puppeteer from 'puppeteer'

class SimplePuppeteerMCPServer {
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
            },
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
            },
            required: ['selector'],
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
      ],
    }))

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      try {
        switch (name) {
          case 'launch_browser':
            return await this.launchBrowser(args)
          case 'take_screenshot':
            return await this.takeScreenshot(args)
          case 'click_element':
            return await this.clickElement(args)
          case 'get_page_info':
            return await this.getPageInfo()
          case 'close_browser':
            return await this.closeBrowser()
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
          text: `✅ Browser launched and navigated to ${url}\nReady for testing your church app!`,
        },
      ],
    }
  }

  async takeScreenshot(args = {}) {
    if (!this.page) {
      throw new Error('Browser not launched. Use launch_browser first.')
    }

    const { filename = 'screenshot.png' } = args
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const screenshotName = `${timestamp}-${filename}`
    const screenshotPath = `./screenshots/${screenshotName}`

    // Create screenshots directory
    const fs = await import('fs/promises')
    await fs.mkdir('./screenshots', { recursive: true })

    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true,
    })

    return {
      content: [
        {
          type: 'text',
          text: `📸 Screenshot saved: ${screenshotPath}`,
        },
      ],
    }
  }

  async clickElement(args) {
    if (!this.page) {
      throw new Error('Browser not launched. Use launch_browser first.')
    }

    const { selector } = args
    const element = await this.page.$(selector)

    if (!element) {
      throw new Error(`Element not found: ${selector}`)
    }

    await element.click()
    await this.page.waitForTimeout(1000)

    return {
      content: [
        {
          type: 'text',
          text: `🖱️ Clicked element: ${selector}`,
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
          text: `📄 Page Info:\nURL: ${url}\nTitle: ${title}`,
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
          text: '🔚 Browser closed',
        },
      ],
    }
  }

  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('Simple Puppeteer MCP server running on stdio')
  }
}

const server = new SimplePuppeteerMCPServer()
server.run().catch(console.error)