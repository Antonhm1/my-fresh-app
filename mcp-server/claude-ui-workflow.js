#!/usr/bin/env node

import { DevWorkflow, ChurchAppWorkflows } from './dev-workflow.js'

/**
 * Claude UI Development Workflow
 * This class provides Claude with automated UI testing capabilities
 * for iterative development of the church app.
 */
export class ClaudeUIWorkflow {
  constructor() {
    this.workflow = null
    this.isActive = false
    this.currentComponent = null
  }

  async startSession(description = 'UI development session') {
    if (this.isActive) {
      await this.endSession()
    }

    this.workflow = new DevWorkflow()
    await this.workflow.init()
    this.isActive = true

    console.log(`🚀 Claude UI Workflow started: ${description}`)

    // Take initial baseline screenshot
    const initialReport = await this.workflow.testCurrentUI(`Baseline: ${description}`)

    return {
      sessionStarted: true,
      description,
      initialReport: {
        totalTests: initialReport.totalTests,
        passedTests: initialReport.passedTests,
        failedTests: initialReport.failedTests
      }
    }
  }

  async testUIAfterChange(changeDescription) {
    if (!this.isActive) {
      throw new Error('UI workflow not active. Call startSession() first.')
    }

    console.log(`🔄 Testing UI after change: ${changeDescription}`)

    // Wait a moment for any UI changes to settle
    await new Promise(resolve => setTimeout(resolve, 1000))

    const validationResult = await this.workflow.validateUIChange(changeDescription)

    return {
      changeDescription,
      allTestsPassed: validationResult.allPassed,
      validationResults: validationResult.validationResults,
      screenshot: true,
      recommendations: this.generateRecommendations(validationResult)
    }
  }

  async iterateOnComponent(componentName, expectedFeatures = []) {
    if (!this.isActive) {
      throw new Error('UI workflow not active. Call startSession() first.')
    }

    this.currentComponent = componentName
    console.log(`🔄 Starting iteration on ${componentName}`)

    let iterationResult

    switch (componentName.toLowerCase()) {
      case 'eventcard':
      case 'event-card':
        iterationResult = await ChurchAppWorkflows.testEventCard(this.workflow)
        break
      case 'bannersystem':
      case 'banner-system':
        iterationResult = await ChurchAppWorkflows.testBannerSystem(this.workflow)
        break
      case 'navigation':
      case 'burger-menu':
        iterationResult = await ChurchAppWorkflows.testNavigationMenu(this.workflow)
        break
      default:
        // Generic component testing
        iterationResult = await this.workflow.iterateOnComponent(componentName, async (testSuite, iteration) => {
          console.log(`🧪 Testing ${componentName} iteration ${iteration}`)

          const results = []
          for (const feature of expectedFeatures) {
            const result = await testSuite.testElement(feature.selector, feature.description, feature.shouldExist !== false)
            results.push({ ...feature, passed: result })
          }

          return {
            iteration,
            results,
            shouldContinue: results.some(r => !r.passed) && iteration < 3
          }
        })
    }

    return {
      componentName,
      iterations: iterationResult.iterations,
      completed: iterationResult.iterations < 5,
      finalState: iterationResult.finalResult,
      nextSteps: this.generateNextSteps(componentName, iterationResult)
    }
  }

  async takeProgressScreenshot(description) {
    if (!this.isActive) {
      throw new Error('UI workflow not active. Call startSession() first.')
    }

    await this.workflow.testSuite.takeScreenshot('progress', description)
    return { screenshot: true, description }
  }

  async endSession() {
    if (!this.isActive) {
      return { message: 'No active session to end' }
    }

    const report = await this.workflow.generateIterationReport()
    await this.workflow.close()

    this.isActive = false
    this.currentComponent = null

    console.log('🏁 Claude UI Workflow session ended')

    return {
      sessionEnded: true,
      report: {
        totalSessions: report.summary.totalSessions,
        averageTests: report.summary.averageTests,
        successRate: report.summary.overallSuccessRate
      }
    }
  }

  generateRecommendations(validationResult) {
    const recommendations = []

    if (!validationResult.allPassed) {
      recommendations.push('❌ Some tests failed. Consider reviewing the changes.')
    }

    const failedTests = validationResult.validationResults.filter(r => !r.passed)
    for (const test of failedTests) {
      recommendations.push(`🔧 Fix: ${test.description}`)
    }

    if (validationResult.allPassed) {
      recommendations.push('✅ All tests passed! Ready for next iteration.')
    }

    return recommendations
  }

  generateNextSteps(componentName, iterationResult) {
    const steps = []

    if (iterationResult.iterations >= 5) {
      steps.push('⚠️  Maximum iterations reached. Consider breaking down the component.')
    }

    switch (componentName.toLowerCase()) {
      case 'eventcard':
        if (!iterationResult.finalResult?.hasEventCard) {
          steps.push('1. Create EventCard component with proper structure')
          steps.push('2. Add data-testid attributes for testing')
          steps.push('3. Implement responsive design')
        }
        break
      case 'bannersystem':
        if (!iterationResult.finalResult?.hasBanners) {
          steps.push('1. Create Banner component')
          steps.push('2. Implement banner grid layout')
          steps.push('3. Add banner management functionality')
        }
        break
      case 'navigation':
        if (!iterationResult.finalResult?.hasBurgerMenu) {
          steps.push('1. Create burger menu component')
          steps.push('2. Implement mobile navigation')
          steps.push('3. Add menu toggle functionality')
        }
        break
    }

    return steps
  }

  // Quick testing utilities
  async quickUICheck() {
    if (!this.isActive) {
      await this.startSession('Quick UI check')
    }

    return await this.workflow.testCurrentUI('Quick validation')
  }

  getStatus() {
    return {
      isActive: this.isActive,
      currentComponent: this.currentComponent,
      hasWorkflow: this.workflow !== null
    }
  }
}

// Singleton instance for Claude to use
export const claudeUI = new ClaudeUIWorkflow()

// Helper functions for Claude to use directly
export const ui = {
  async start(description) {
    return await claudeUI.startSession(description)
  },

  async test(changeDescription) {
    return await claudeUI.testUIAfterChange(changeDescription)
  },

  async iterate(componentName, expectedFeatures) {
    return await claudeUI.iterateOnComponent(componentName, expectedFeatures)
  },

  async screenshot(description) {
    return await claudeUI.takeProgressScreenshot(description)
  },

  async end() {
    return await claudeUI.endSession()
  },

  async quickCheck() {
    return await claudeUI.quickUICheck()
  },

  status() {
    return claudeUI.getStatus()
  }
}

// CLI usage for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    console.log('🧪 Testing Claude UI Workflow...')

    await ui.start('Testing the workflow system')
    await ui.screenshot('Initial state')
    await ui.test('Added basic structure')
    await ui.iterate('EventCard', [
      { selector: '[data-testid="event-card"]', description: 'Event card component' },
      { selector: '.event-title', description: 'Event title' }
    ])
    const report = await ui.end()

    console.log('✅ Workflow test completed:', report)
  } catch (error) {
    console.error('❌ Workflow test failed:', error)
    await ui.end()
  }
}