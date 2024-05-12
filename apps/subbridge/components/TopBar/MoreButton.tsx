import {
  colorSchemeSettingAtom,
  moreButtonBadgeVersionAtom,
} from '@/store/common'
import {OpenInNew} from '@mui/icons-material'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import {Badge, Box, Button, ButtonGroup, Menu, MenuItem} from '@mui/material'
import {useAtom} from 'jotai'
import {type FC, type MouseEvent, useState} from 'react'
import {ClientOnly} from '../ClientOnly'

const CURRENT_BADGE_VERSION = 2

const externalLinks = [
  [
    'Explorer',
    'https://analytics.phala.network/public-dashboards/346284964a334ee3a5cc72e1523eccea?orgId=1',
  ],
  ['Wiki', 'https://wiki.phala.network/en-us/general/subbridge/intro/'],
  ['Discord', 'https://discord.gg/phala-network'],
  ['Forum', 'https://forum.phala.network/c/mai/73-category/73'],
  ['Phala App', 'https://app.phala.network'],
]

const MoreButton: FC = () => {
  const [colorSchemeSetting, setColorSchemeSetting] = useAtom(
    colorSchemeSettingAtom,
  )
  const [moreButtonBadgeVersion, setMoreButtonBadgeVersion] = useAtom(
    moreButtonBadgeVersionAtom,
  )
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLElement>): void => {
    setMoreButtonBadgeVersion(CURRENT_BADGE_VERSION)
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (): void => {
    setAnchorEl(null)
  }

  return (
    <>
      <ClientOnly>
        <Badge
          color="error"
          variant="dot"
          invisible={CURRENT_BADGE_VERSION === moreButtonBadgeVersion}
          sx={{
            '& .MuiBadge-badge': {
              top: 3,
              right: 3,
            },
          }}
        >
          <Button
            sx={{
              minWidth: 0,
              px: 1,
            }}
            onClick={handleClick}
          >
            <MoreHoriz />
          </Button>
        </Badge>
      </ClientOnly>
      <Menu
        sx={{mt: 1}}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {externalLinks.map(([text, href]) => (
          <MenuItem
            key={text}
            onClick={() => {
              window.open(href)
              handleClose()
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: 1,
                alignItems: 'center',
              }}
            >
              <span>{text}</span>
              <OpenInNew color="action" fontSize="inherit" />
            </Box>
          </MenuItem>
        ))}

        <ButtonGroup size="small" sx={{mt: 1, mx: 1}}>
          {(['light', 'system', 'dark'] as const).map((value) => (
            <Button
              key={value}
              sx={{textTransform: 'capitalize'}}
              onClick={() => {
                setColorSchemeSetting(value)
              }}
              variant={colorSchemeSetting === value ? 'contained' : 'outlined'}
            >
              {value}
            </Button>
          ))}
        </ButtonGroup>
      </Menu>
    </>
  )
}

export default MoreButton
