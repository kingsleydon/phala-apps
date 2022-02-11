import {Button, ToasterContainer} from '@phala/react-components'
import {PLACEMENT} from 'baseui/toast'
import {FC, useState} from 'react'
import {Helmet} from 'react-helmet'
import {QueryClient, QueryClientProvider} from 'react-query'
import {ExchangeIcon} from './components/ExchangeIcon'
import {ExtraInfoPanel} from './components/ExtraInfoPanel'
import {Header} from './components/Header'
import {InformationModal} from './components/InformationModal'
import {SubmitButton} from './components/SubmitButton'
import {TransferFromPanel} from './components/TransferFromPanel'
import {TransferModal} from './components/TransferModal'
import {TransferToPanel} from './components/TransferToPanel'
import {useExtraInfo} from './hooks/useExtraInfo'
import {useAllTransferData, useSwitchToAndFormData} from './store'
import {BlockItem, MainContent, Root} from './styledComponents'

const queryClient = new QueryClient()

export const BridgePage: FC = () => {
  const transactionInfo = useAllTransferData()
  const [isOpenTransferModal, setIsOpenTransferModal] = useState(false)
  const [isOpenInformationModal, setIsOpenInformationModal] = useState(false)
  const switchData = useSwitchToAndFormData()
  const extraInfo = useExtraInfo()

  const submit = () => {
    setIsOpenTransferModal(true)
  }

  return (
    <QueryClientProvider contextSharing={true} client={queryClient}>
      <Root>
        <Helmet>
          <title>Bridge</title>
        </Helmet>

        <MainContent>
          <Header />

          <BlockItem>
            <TransferFromPanel />

            <ExchangeIcon onClick={switchData} />

            <TransferToPanel />
          </BlockItem>

          <BlockItem>
            <ExtraInfoPanel infos={extraInfo} />
          </BlockItem>

          <BlockItem>
            <SubmitButton onSubmit={submit} />
          </BlockItem>
        </MainContent>

        <TransferModal
          transactionInfo={transactionInfo}
          onClose={() => {
            setIsOpenTransferModal(false)
          }}
          isOpen={isOpenTransferModal}
        />

        <InformationModal
          onClose={() => {
            setIsOpenInformationModal(false)
          }}
          isOpen={isOpenInformationModal}
        />
      </Root>

      {/* <Transactions /> */}

      <ToasterContainer placement={PLACEMENT.topRight} />

      <Button onClick={() => setIsOpenInformationModal(true)}>
        Open InformationModal
      </Button>

      <Button onClick={() => setIsOpenTransferModal(true)}>
        Open TransferModal
      </Button>
    </QueryClientProvider>
  )
}
