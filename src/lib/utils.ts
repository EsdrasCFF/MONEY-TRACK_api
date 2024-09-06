import { TRANSACTION_TYPE } from '@prisma/client'
import validator from 'validator'

import dayjs from './dayjs-setup'

export function checkIfDateIsInFuture(date: string | Date): boolean {
  return dayjs(date).isAfter(new Date())
}

export function checkIfAmountIsValid(amount: string): boolean {
  const decimalPattern = /^[0-9]+(\.[0-9]{1,2})?$/

  return validator.isNumeric(amount) && validator.matches(amount, decimalPattern)
}

export function convertAmountToHundredUnits(amount: number, type: TRANSACTION_TYPE) {
  const isIncome = type == 'INCOME'

  if (isIncome) {
    return amount * 100
  }

  return amount * 100 * -1
}
