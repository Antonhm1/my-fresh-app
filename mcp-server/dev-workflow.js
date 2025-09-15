#!/usr/bin/env node

import { ChurchAppTestSuite } from './ui-test-runner.js'
import fs from 'fs/promises'
import path from 'path'

export class DevWorkflow {
  constructor() {
    this.testSuite = null
    this.workflowHistory = []
  }

  async init() {
    this.testSuite = new ChurchAppTestSuite()
    await this.testSuite.init()
    console.log('🔧 Development workflow initialized')
  }

  async testCurrentUI(description = 'UI state test') {
    console.log(`\n🧪 Testing current UI: ${description}`)
    console.log('-'.repeat(50))

    const report = await this.testSuite.runBasicTests()

    this.workflowHistory.push({
      timestamp: new Date().toISOString(),
      description,
      report: {
        totalTests: report.totalTests,
        passedTests: report.passedTests,
        failedTests: report.failedTests,
        screenshots: report.screenshots
      }
    })

    return report
  }

  async validateUIChange(changeDescription) {
    console.log(`\n✅ Validating UI change: ${changeDescription}`)

    // Take screenshot of current state
    await this.testSuite.takeScreenshot('validation', `After: ${changeDescription}`)

    // Run specific validation tests
    const validationResults = []

    // Test for common issues
    const checks = [
      { selector: 'h1', description: 'Main heading still exists' },
      { selector: 'body', description: 'Body element exists' },
      { selector: '[data-testid]', description: 'Test IDs are preserved', shouldExist: false } // Will be false until we add them
    ]

    for (const check of checks) {
      const result = await this.testSuite.testElement(
        check.selector,
        check.description,
        check.shouldExist !== false
      )
      validationResults.push({ ...check, passed: result })
    }

    // Test responsive behavior
    await this.testSuite.testResponsive([
      { width: 375, height: 667, name: 'mobile' },
      { width: 1280, height: 720, name: 'desktop' }
    ])

    return {
      changeDescription,
      validationResults,
      allPassed: validationResults.every(r => r.passed),
      timestamp: new Date().toISOString()
    }
  }

  async iterateOnComponent(componentName, testFunction) {
    console.log(`\n🔄 Starting iteration on component: ${componentName}`)

    let iterationCount = 0
    const maxIterations = 5
    let lastReport = null

    while (iterationCount < maxIterations) {
      iterationCount++
      console.log(`\n📋 Iteration ${iterationCount} - Testing ${componentName}`)

      // Run the test function
      const iterationResult = await testFunction(this.testSuite, iterationCount)

      // Take screenshot of current iteration
      await this.testSuite.takeScreenshot(
        `iteration-${iterationCount}-${componentName}`,
        `Iteration ${iterationCount} of ${componentName}`
      )

      // Check if we should continue iterating
      if (iterationResult.shouldContinue === false) {
        console.log(`✅ Component ${componentName} completed after ${iterationCount} iterations`)
        break
      }

      lastReport = iterationResult
    }

    return {
      componentName,
      iterations: iterationCount,
      finalResult: lastReport,
      timestamp: new Date().toISOString()
    }
  }

  async generateIterationReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      workflowHistory: this.workflowHistory,
      summary: {
        totalSessions: this.workflowHistory.length,
        averageTests: this.workflowHistory.reduce((acc, h) => acc + (h.report?.totalTests || 0), 0) / this.workflowHistory.length,
        overallSuccessRate: this.workflowHistory.reduce((acc, h) => {
          const total = h.report?.totalTests || 0
          const passed = h.report?.passedTests || 0
          return acc + (total > 0 ? passed / total : 0)
        }, 0) / this.workflowHistory.length
      }
    }

    const reportPath = `test-reports/dev-workflow-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    await fs.mkdir('test-reports', { recursive: true })
    await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2))

    console.log('\n📈 DEVELOPMENT WORKFLOW REPORT')
    console.log('=' .repeat(50))
    console.log(`📊 Total test sessions: ${reportData.summary.totalSessions}`)
    console.log(`🧪 Average tests per session: ${reportData.summary.averageTests.toFixed(1)}`)
    console.log(`✅ Overall success rate: ${(reportData.summary.overallSuccessRate * 100).toFixed(1)}%`)
    console.log(`📄 Report saved: ${reportPath}`)

    return reportData
  }

  async close() {
    if (this.testSuite) {
      await this.testSuite.close()
    }
  }
}

// Example usage patterns for church app development
export const ChurchAppWorkflows = {
  // Test event card component development
  async testEventCard(workflow) {
    return await workflow.iterateOnComponent('EventCard', async (testSuite, iteration) => {
      console.log(`🎫 Testing EventCard iteration ${iteration}`)

      // Test basic event card structure
      const hasCard = await testSuite.testElement('.event-card, [data-testid="event-card"]', 'Event card exists', false)

      // Test event card content
      if (hasCard) {
        await testSuite.testElement('.event-title', 'Event title exists')
        await testSuite.testElement('.event-description', 'Event description exists')
        await testSuite.testElement('.read-more', 'Read more button exists')
      }

      // Test responsive behavior
      await testSuite.testResponsive([{ width: 375, height: 667, name: 'mobile' }])

      return {
        iteration,
        hasEventCard: hasCard,
        shouldContinue: !hasCard && iteration < 3 // Continue if no card found and under 3 iterations
      }
    })
  },

  // Test banner system development
  async testBannerSystem(workflow) {
    return await workflow.iterateOnComponent('BannerSystem', async (testSuite, iteration) => {
      console.log(`🎯 Testing Banner System iteration ${iteration}`)

      const hasBanners = await testSuite.testElement('.banner, [data-testid="banner"]', 'Banner exists', false)
      const hasBannerGrid = await testSuite.testElement('.banner-grid', 'Banner grid exists', false)

      return {
        iteration,
        hasBanners,
        hasBannerGrid,
        shouldContinue: (!hasBanners || !hasBannerGrid) && iteration < 3
      }
    })
  },

  // Test navigation menu development
  async testNavigationMenu(workflow) {
    return await workflow.iterateOnComponent('NavigationMenu', async (testSuite, iteration) => {
      console.log(`🍔 Testing Navigation Menu iteration ${iteration}`)

      const hasBurgerMenu = await testSuite.testElement('.burger-menu, [data-testid="burger-menu"]', 'Burger menu exists', false)

      if (hasBurgerMenu) {
        // Test menu interaction
        await testSuite.testInteraction('.burger-menu', 'click', 'Open burger menu')
        await testSuite.testElement('.mobile-menu', 'Mobile menu appears after click', false)
      }

      return {
        iteration,
        hasBurgerMenu,
        shouldContinue: !hasBurgerMenu && iteration < 3
      }
    })
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const workflow = new DevWorkflow()

  try {
    await workflow.init()

    // Run initial test
    await workflow.testCurrentUI('Initial state')

    // Example: Test event card development
    await ChurchAppWorkflows.testEventCard(workflow)

    await workflow.generateIterationReport()
  } catch (error) {
    console.error('🔥 Development workflow failed:', error)
  } finally {
    await workflow.close()
  }
}