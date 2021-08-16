import { useEthereumAccountAtom } from '@phala/app-store'
import { AlertModal } from '@phala/react-components'
import { useSSR } from '@phala/react-hooks'
import React, { useEffect, useMemo } from 'react'
import { useEthers } from '../libs/ethereum/contexts/useEthers'
import { useAccountsQuery } from '../libs/ethereum/queries/useAccountsQuery'
import { Account, voidFn } from '../types/normal'
import EthereumInstallModal from './EthereumInstallModal'
import SelectAccountModal from './SelectAccountModal'

type Props = {
  visible: boolean
  onClose: voidFn
}

const EthereumAccountModal: React.FC<Props> = (props) => {
  const { data: accounts = [] } = useAccountsQuery()
  const { readystate: readyState } = useEthers()
  const isReady = readyState === 'connected'
  const [ethereumAccount, setEthereumAccount] = useEthereumAccountAtom()
  const accountsIsEmpty = accounts.length === 0
  const ethereumAccounts = useMemo(
    () =>
      accounts?.map<Account>((address) => ({
        address,
      })),
    [accounts]
  )
  const { isServer } = useSSR()

  useEffect(() => {
    const [account] = accounts
    if (!accounts || !isReady || accountsIsEmpty) {
      return
    }

    setEthereumAccount({
      name: account,
      address: account || '',
    })
  }, [accounts])

  if (isServer) return null

  if (window && !window?.web3?.currentProvider?.isMetaMask) {
    return <EthereumInstallModal {...props}></EthereumInstallModal>
  }

  if (!isReady) {
    return (
      <AlertModal
        content="Please allow access in the MetaMask extension."
        {...props}
      />
    )
  }

  if (accountsIsEmpty) {
    return (
      <AlertModal
        content="No account found, please add account in your wallet extension or unlock it."
        {...props}
      />
    )
  }

  return (
    <SelectAccountModal
      {...props}
      accounts={ethereumAccounts}
      currentAccount={ethereumAccount}
      onSelect={(account) => setEthereumAccount(account)}
    />
  )
}

export default EthereumAccountModal
