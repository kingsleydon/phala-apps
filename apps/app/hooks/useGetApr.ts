import {subsquidClient} from '@/lib/graphql'
import {
  useGlobalStateQuery,
  useTokenomicParametersQuery,
} from '@/lib/subsquidQuery'
import Decimal from 'decimal.js'
import {useCallback} from 'react'

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

const useGetApr = () => {
  const {data: globalStateData} = useGlobalStateQuery(subsquidClient, {})
  const {data: tokenomicParamatersData} = useTokenomicParametersQuery(
    subsquidClient,
    {}
  )

  const {averageBlockTime, idleWorkerShares} =
    globalStateData?.globalStateById || {}
  const {budgetPerBlock, treasuryRatio} =
    tokenomicParamatersData?.tokenomicParametersById || {}

  return useCallback(
    (aprMultiplier: string) => {
      if (
        !averageBlockTime ||
        !idleWorkerShares ||
        !budgetPerBlock ||
        !treasuryRatio
      ) {
        return
      }
      return new Decimal(budgetPerBlock)
        .times(new Decimal(treasuryRatio).negated().add(1))
        .times(ONE_YEAR)
        .div(averageBlockTime)
        .div(idleWorkerShares)
        .times(aprMultiplier)
    },
    [averageBlockTime, budgetPerBlock, idleWorkerShares, treasuryRatio]
  )
}

export default useGetApr