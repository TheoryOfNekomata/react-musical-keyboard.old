import * as React from 'react'
import * as Storybook from '@storybook/react'
import { withKnobs, } from '@storybook/addon-knobs'
import { withActions, } from '@storybook/addon-actions'
import { withInfo, } from '@storybook/addon-info'
//import { DocsPage, } from '@storybook/addon-docs/blocks'

Storybook.addParameters({
  info: {
    inline: true,
    styles: {
      infoStory: {
        fontFamily: 'sans-serif',
      }
    }
  },
  options: {
    panelPosition: 'right',
    showNav: false,
  },
  //docs: ({ context, }) => (
  //  React.createElement(
  //    DocsPage,
  //    {
  //      context,
  //    }
  //  )
  //),
})

Storybook.addDecorator(withInfo)
Storybook.addDecorator(withKnobs)
Storybook.configure(() => { require('../src/MusicalKeyboard.stories.jsx') }, module)
