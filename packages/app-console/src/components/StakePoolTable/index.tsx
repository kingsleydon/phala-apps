import {Button} from '@phala/react-components'
import {toFixed} from '@phala/utils'
import {useMemo, useState} from 'react'
import {Column} from 'react-table'
import {StakePool} from '@phala/react-hooks'
import useFormat from '../../hooks/useFormat'
import useModalVisible, {ModalKey} from '../../hooks/useModalVisible'
import useSelfStakePools from '../../hooks/useSelfStakePools'
import ConsoleTable from '../ConsoleTable'
import AddWorkerModal from './AddWorkerModal'
import ClaimModal from './ClaimModal'
import ContributeModal from './ContributeModal'
import CreateModal from './CreateModal'
import SetCapModal from './SetCapModal'
import SetPayoutPrefModal from './SetPayoutPrefModal'
import StakeInfoModal from './StakeInfoModal'
import StakePoolActions from './StakePoolActions'
import WithdrawModal from './WithdrawModal'

export type StakePoolModalProps = {onClose: () => void; stakePool: StakePool}

const modalEntries: [ModalKey, (props: StakePoolModalProps) => JSX.Element][] =
  [
    ['claim', ClaimModal],
    ['contribute', ContributeModal],
    ['addWorker', AddWorkerModal],
    ['setCap', SetCapModal],
    ['setPayoutPref', SetPayoutPrefModal],
    ['stakeInfo', StakeInfoModal],
    ['withdraw', WithdrawModal],
  ]

const StakePoolTable = (): JSX.Element => {
  const {modalVisible, open, close, visibleCount} = useModalVisible()
  const [selectedPid, setSelectedPid] = useState<number | null>(null)
  const {data, refetch, isLoading} = useSelfStakePools()
  const format = useFormat()

  const selectedStakePool = useMemo<StakePool | null>(
    () =>
      (data &&
        typeof selectedPid === 'number' &&
        data.find((v) => v.pid === selectedPid)) ||
      null,
    [data, selectedPid]
  )

  const columns = useMemo<Column<StakePool>[]>(
    () => [
      {Header: 'pid', accessor: 'pid'},
      {
        Header: 'Commission',
        accessor: (stakePool) =>
          `${toFixed(stakePool.payoutCommission.div(10 ** 4), 2)}%`,
      },
      {
        Header: 'Cap',
        accessor: (stakePool) =>
          stakePool.cap === null ? '∞' : format(stakePool.cap),
      },
      {
        Header: 'Owner Reward',
        accessor: (stakePool) => format(stakePool.ownerReward),
      },
      {
        Header: 'Total Stake',
        accessor: (stakePool) => format(stakePool.totalStake),
      },
      {
        Header: 'Free Stake',
        accessor: (stakePool) => format(stakePool.freeStake),
      },
      {
        Header: 'Releasing Stake',
        accessor: (stakePool) => format(stakePool.releasingStake),
      },
      {
        Header: 'Actions',
        accessor: (stakePool) => (
          <StakePoolActions setPid={setSelectedPid} stakePool={stakePool} />
        ),
        disableSortBy: true,
      },
    ],
    [format]
  )
  return (
    <>
      <ConsoleTable
        title="Stakepool"
        header={
          <Button
            size="small"
            style={{marginLeft: 10}}
            onClick={() => open('create')}
          >
            Create pool
          </Button>
        }
        columns={columns}
        data={data || []}
        isLoading={isLoading}
      ></ConsoleTable>

      {/* CreateModal is special */}
      {modalVisible.create && (
        <CreateModal
          onClose={() => {
            close('create')
            refetch()
          }}
        ></CreateModal>
      )}

      {selectedStakePool &&
        modalEntries.map(
          ([modalKey, Modal]) =>
            modalVisible[modalKey] && (
              <Modal
                key={modalKey}
                stakePool={selectedStakePool}
                onClose={() => {
                  close(modalKey)
                  refetch()
                  // NOTE: if current modal is the last modal, reset selected pid
                  if (visibleCount <= 1) {
                    setSelectedPid(null)
                  }
                }}
              />
            )
        )}
    </>
  )
}

export default StakePoolTable
