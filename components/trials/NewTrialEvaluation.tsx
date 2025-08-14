'use client'

import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import WizardStepCard from '@/components/wizard/controls/WizardStepCard'
import StarRating from '@/components/wizard/steps/StarRating'
import MultiSelectChips, { type Option as MultiSelectOption } from '@/components/wizard/controls/MultiSelectChips'
import ToggleSwitch from '@/components/wizard/controls/ToggleSwitch'
import reviewStyles from '@/components/wizard/steps/ReviewSubmission.module.css'

interface NewTrialEvaluationProps {
  rating: number
  onRatingChange: (value: number) => void
  tastingNoteOptions: MultiSelectOption[]
  selectedTastingNotes: (number | string)[]
  onTastingNotesChange: (values: (number | string)[]) => void
  reviewRegister: UseFormRegisterReturn
  reviewValue: string
  minReviewChars?: number
  shouldSell: boolean
  onShouldSellChange: (checked: boolean) => void
}

const NewTrialEvaluation = ({
  rating,
  onRatingChange,
  tastingNoteOptions,
  selectedTastingNotes,
  onTastingNotesChange,
  reviewRegister,
  reviewValue,
  minReviewChars = 150,
  shouldSell,
  onShouldSellChange,
}: NewTrialEvaluationProps): JSX.Element => {
  return (
    <WizardStepCard title="Your Evaluation" stepNumber={1} totalSteps={1}>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <div>
          <div style={{ marginBottom: 4 }}>Rating</div>
          <StarRating value={rating} onChange={onRatingChange} />
        </div>

        <div>
          <div style={{ marginBottom: 4 }}>Tasting Notes</div>
          <MultiSelectChips
            options={tastingNoteOptions}
            selectedValues={selectedTastingNotes}
            onChange={onTastingNotesChange}
            name="tasting_notes"
            placeholder="Search..."
          />
        </div>

        <div>
          <div style={{ marginBottom: 4 }}>Review</div>
          <textarea
            className={reviewStyles.textarea}
            rows={5}
            minLength={minReviewChars}
            placeholder={`Write your detailed review here... (minimum ${minReviewChars} characters)`}
            {...reviewRegister}
          />
          <div className={`${reviewStyles.charCount} ${reviewValue.trim().length < minReviewChars ? reviewStyles.error : reviewStyles.success}`}>
            {reviewValue.trim().length < minReviewChars
              ? `${reviewValue.trim().length} / ${minReviewChars} minimum required`
              : <>{reviewValue.trim().length} characters <span className={reviewStyles.checkmark}>✓</span></>}
          </div>
        </div>

        <div>
          <ToggleSwitch
            name="should_sell"
            label="Recommend to sell"
            checked={shouldSell}
            onChange={onShouldSellChange}
          />
        </div>
      </div>
    </WizardStepCard>
  )
}

export default React.memo(NewTrialEvaluation)
