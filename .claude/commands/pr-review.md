Please review the PR/changes focusing on React best practices and code quality for: $ARGUMENTS

Follow these steps:

## ✓ ANALYZE

1. If $ARGUMENTS contains a PR number, use 'gh pr view' to get the PR details
2. If $ARGUMENTS contains branch names, use 'git diff' to analyze the changes
3. Review all modified files comprehensively
4. Understand the purpose and scope of the changes

## ✓ REACT-SPECIFIC REVIEW

Check for proper React patterns:
- ✅ Hook usage (no hooks in conditionals/loops)
- ✅ Components follow single responsibility principle
- ✅ Unnecessary re-renders (missing React.memo, useMemo, useCallback)
- ✅ Proper key props in lists
- ✅ State management (no direct state mutations)
- ✅ Side effects properly contained in useEffect
- ✅ Component size - should be small and focused
- ✅ Functional components over class components

## ✓ CODE QUALITY REVIEW

Examine code quality aspects:
- ✅ Meaningful variable/function/component names
- ✅ No commented-out code left behind
- ✅ No console.logs in production code
- ✅ DRY principle - no code duplicated more than twice
- ✅ Proper error handling for async operations
- ✅ Guard clauses/early returns instead of nested conditionals
- ✅ TypeScript types are properly defined and used

## ✓ DATABASE & API READY

Review for production readiness:
- ✅ No hardcoded values that should be environment variables
- ✅ API endpoints follow RESTful conventions
- ✅ Potential N+1 query problems in data fetching
- ✅ Proper data validation before database operations
- ✅ Sensitive data isn't exposed in responses
- ✅ Input validation on forms

## ✓ PERFORMANCE & SECURITY

Check performance and security:
- ✅ Unnecessary API calls avoided
- ✅ Loading states implemented where needed
- ✅ Images are optimized
- ✅ Bundle size impact of new dependencies
- ✅ No API keys or secrets in code
- ✅ XSS prevention (no dangerouslySetInnerHTML without sanitization)

## ✓ PROVIDE FEEDBACK

Structure feedback as:

### 🐛 Critical Issues
List any bugs or functionality-breaking issues

### 🔧 Improvements
Suggest better implementations for existing code

### 💡 Suggestions
Optional enhancements to consider

### ⚡ Quick Wins
- Replace class components with functional components
- Use optional chaining (?.) instead of long && chains
- Destructure props for cleaner code
- Extract magic numbers to constants
- Split large components into smaller ones

### ✅ Good Practices
Acknowledge what was done well

## ✓ SUMMARY

Provide an overall assessment:
- Overall code quality rating (1-10)
- Main areas of concern
- Recommendations for improvement
- Whether the PR is ready to merge or needs changes

Remember: Be constructive and specific. Instead of "This is wrong", say "Consider using useCallback here to prevent unnecessary re-renders when the component re-renders due to parent state changes."