export class AIConfidenceHelpers {
  static getConfidenceLevel(score: number): string {
    if (score >= 4) return 'High'
    if (score >= 3) return 'Medium'
    if (score >= 2) return 'Low'
    return 'Very Low'
  }

  static getConfidenceContext(score: number): string {
    if (score >= 4) return "High confidence - synthesis from multiple expert sources"
    if (score >= 3) return "Medium confidence - synthesis from several expert sources"
    if (score >= 2) return "Low confidence - limited expert source material"
    return "Very low confidence - minimal expert source material"
  }

  static formatDate(dateString?: string): string {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}
