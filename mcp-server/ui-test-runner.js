#!/usr/bin/env node

import puppeteer from 'puppeteer'
import fs from 'fs/promises'
import path from 'path'

export class UITestRunner {
  constructor(baseUrl = 'http://localhost:5173') {
    this.baseUrl = baseUrl
    this.browser = null
    this.page = null
    this.testResults = []
    this.screenshotCounter = 0
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox'],
    })
    this.page = await this.browser.newPage()

    // Set up console logging
    this.page.on('console', (msg) => {
      console.log(`🖥️  Browser: ${msg.text()}`)
    })

    // Set up error logging
    this.page.on('pageerror', (error) => {
      console.error(`❌ Page Error: ${error.message}`)
      this.testResults.push({
        type: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    })

    await this.page.goto(this.baseUrl)
    console.log(`🚀 Browser launched and navigated to ${this.baseUrl}`)
  }

  async takeScreenshot(name, description = '') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `${timestamp}-${this.screenshotCounter++}-${name}.png`
    const filepath = path.join('screenshots', filename)

    await fs.mkdir('screenshots', { recursive: true })
    await this.page.screenshot({ path: filepath, fullPage: true })

    console.log(`📸 Screenshot: ${filename} - ${description}`)
    this.testResults.push({
      type: 'screenshot',
      filename,
      description,
      timestamp: new Date().toISOString()
    })

    return filepath
  }

  async testElement(selector, description, shouldExist = true) {
    try {
      const element = await this.page.$(selector)
      const exists = element !== null

      if (exists === shouldExist) {
        console.log(`✅ ${description}: Found element ${selector}`)
        this.testResults.push({
          type: 'test_pass',
          selector,
          description,
          timestamp: new Date().toISOString()
        })
        return true
      } else {
        console.log(`❌ ${description}: Element ${selector} ${shouldExist ? 'not found' : 'should not exist'}`)
        this.testResults.push({
          type: 'test_fail',
          selector,
          description,
          expected: shouldExist ? 'exists' : 'not exists',
          actual: exists ? 'exists' : 'not exists',
          timestamp: new Date().toISOString()
        })
        return false
      }
    } catch (error) {
      console.error(`🔥 Error testing ${selector}: ${error.message}`)
      return false
    }
  }

  async testText(selector, expectedText, description) {
    try {
      const element = await this.page.$(selector)
      if (!element) {
        console.log(`❌ ${description}: Element ${selector} not found`)
        return false
      }

      const actualText = await element.evaluate(el => el.textContent?.trim())
      const matches = actualText === expectedText

      if (matches) {
        console.log(`✅ ${description}: Text matches "${expectedText}"`)
        this.testResults.push({
          type: 'test_pass',
          selector,
          description,
          expected: expectedText,
          actual: actualText,
          timestamp: new Date().toISOString()
        })
        return true
      } else {
        console.log(`❌ ${description}: Expected "${expectedText}", got "${actualText}"`)
        this.testResults.push({
          type: 'test_fail',
          selector,
          description,
          expected: expectedText,
          actual: actualText,
          timestamp: new Date().toISOString()
        })
        return false
      }
    } catch (error) {
      console.error(`🔥 Error testing text ${selector}: ${error.message}`)
      return false
    }
  }

  async testResponsive(breakpoints = [{ width: 375, height: 667, name: 'mobile' }, { width: 768, height: 1024, name: 'tablet' }]) {
    const results = []

    for (const bp of breakpoints) {
      await this.page.setViewport({ width: bp.width, height: bp.height })
      await this.page.waitForTimeout(500) // Let layout settle

      const screenshot = await this.takeScreenshot(`responsive-${bp.name}`, `${bp.name} view (${bp.width}x${bp.height})`)

      results.push({
        breakpoint: bp,
        screenshot,
        timestamp: new Date().toISOString()
      })

      console.log(`📱 Tested ${bp.name} breakpoint: ${bp.width}x${bp.height}`)
    }

    // Reset to desktop
    await this.page.setViewport({ width: 1280, height: 720 })

    return results
  }

  async testInteraction(selector, action, description) {
    try {
      const beforeScreenshot = await this.takeScreenshot(`before-${action}`, `Before ${description}`)

      const element = await this.page.$(selector)
      if (!element) {
        console.log(`❌ ${description}: Element ${selector} not found for interaction`)
        return false
      }

      switch (action) {
        case 'click':
          await element.click()
          break
        case 'hover':
          await element.hover()
          break
        case 'focus':
          await element.focus()
          break
        default:
          console.log(`❌ Unknown action: ${action}`)
          return false
      }

      await this.page.waitForTimeout(1000) // Let interaction complete

      const afterScreenshot = await this.takeScreenshot(`after-${action}`, `After ${description}`)

      console.log(`🖱️  ${description}: ${action} on ${selector}`)
      this.testResults.push({
        type: 'interaction',
        selector,
        action,
        description,
        beforeScreenshot,
        afterScreenshot,
        timestamp: new Date().toISOString()
      })

      return true
    } catch (error) {
      console.error(`🔥 Error during interaction ${selector}: ${error.message}`)
      return false
    }
  }

  async testForm(formSelector, inputs, submitSelector, description) {
    try {
      console.log(`📝 Testing form: ${description}`)

      await this.takeScreenshot('form-before', `Before filling ${description}`)

      for (const [inputSelector, value] of Object.entries(inputs)) {
        const input = await this.page.$(inputSelector)
        if (input) {
          await input.clear()
          await input.type(value)
          console.log(`  ✏️  Filled ${inputSelector} with "${value}"`)
        } else {
          console.log(`  ❌ Input not found: ${inputSelector}`)
        }
      }

      await this.takeScreenshot('form-filled', `After filling ${description}`)

      if (submitSelector) {
        await this.testInteraction(submitSelector, 'click', `Submit ${description}`)
      }

      return true
    } catch (error) {
      console.error(`🔥 Error testing form: ${error.message}`)
      return false
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      totalTests: this.testResults.filter(r => r.type.startsWith('test_')).length,
      passedTests: this.testResults.filter(r => r.type === 'test_pass').length,
      failedTests: this.testResults.filter(r => r.type === 'test_fail').length,
      screenshots: this.testResults.filter(r => r.type === 'screenshot').length,
      interactions: this.testResults.filter(r => r.type === 'interaction').length,
      errors: this.testResults.filter(r => r.type === 'error').length,
      results: this.testResults
    }

    const reportPath = `test-reports/ui-test-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    await fs.mkdir('test-reports', { recursive: true })
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2))

    console.log('\n📊 TEST REPORT SUMMARY')
    console.log('=' .repeat(50))
    console.log(`🎯 Total Tests: ${report.totalTests}`)
    console.log(`✅ Passed: ${report.passedTests}`)
    console.log(`❌ Failed: ${report.failedTests}`)
    console.log(`📸 Screenshots: ${report.screenshots}`)
    console.log(`🖱️  Interactions: ${report.interactions}`)
    console.log(`🔥 Errors: ${report.errors}`)
    console.log(`📄 Report saved: ${reportPath}`)
    console.log('=' .repeat(50))

    return report
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
      console.log('🔚 Browser closed')
    }
  }
}

// Church App Specific Test Suite
export class ChurchAppTestSuite extends UITestRunner {
  async runBasicTests() {
    console.log('\n🏛️  CHURCH APP - BASIC TESTS')
    console.log('=' .repeat(40))

    await this.takeScreenshot('homepage', 'Initial homepage load')

    // Test basic page structure
    await this.testElement('h1', 'Main heading exists')
    await this.testElement('nav', 'Navigation exists')
    await this.testText('h1', 'Vite + React', 'Check main heading text')

    // Test responsive design
    await this.testResponsive()

    return await this.generateReport()
  }

  async runEventManagementTests() {
    console.log('\n📅 CHURCH APP - EVENT MANAGEMENT TESTS')
    console.log('=' .repeat(40))

    // Test login flow (when implemented)
    await this.testElement('[data-testid="login-button"]', 'Login button exists', false) // Should not exist yet

    // Test event creation (when implemented)
    await this.testElement('[data-testid="add-event-button"]', 'Add event button exists', false)

    return await this.generateReport()
  }

  async runFullSuite() {
    console.log('\n🚀 RUNNING FULL CHURCH APP TEST SUITE')
    console.log('=' .repeat(50))

    await this.runBasicTests()
    await this.runEventManagementTests()

    const finalReport = await this.generateReport()
    return finalReport
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const suite = new ChurchAppTestSuite()

  try {
    await suite.init()
    await suite.runFullSuite()
  } catch (error) {
    console.error('🔥 Test suite failed:', error)
  } finally {
    await suite.close()
  }
}