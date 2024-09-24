import { TRANSACTION_TYPE } from '@prisma/client'
import { isAfter } from 'date-fns'
import validator from 'validator'

export function checkIfDateIsInFuture(date: string | Date): boolean {
  return isAfter(date, new Date())
}

export function checkIfAmountIsValid(amount: string): boolean {
  const decimalPattern = /^[0-9]+(\.[0-9]{1,2})?$/

  return validator.isNumeric(amount) && validator.matches(amount, decimalPattern)
}

export function convertFromAmountToHundredUnits(amount: number, type: TRANSACTION_TYPE) {
  const isIncome = type == 'INCOME'

  if (isIncome) {
    return amount * 100
  }

  return amount * 100 * -1
}

export function convertFromHundredUnitsToAmount(amount: number | bigint) {
  return Number(amount) / 100
}
