import React from 'react'
import styled from 'styled-components'
import api from '../../../api'
import { BlockValue, SignedFileUrls, UnsignedUrl } from '../../../api/types'
import FigureBlockContainer from './figureBlockContainer'
import FigureCaption from './figureCaption'

const Image = styled.img`
  object-fit: contain;
  width: ${props => props.width};
  max-width: 100%;
`

interface Props {
  value: BlockValue
}

interface State {
  width: number
  source: string
}

class ImageBlock extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      width: -1,
      source: '',
    }
  }

  async componentDidMount(): Promise<void> {
    const { id, format, properties } = this.props.value
    if (format !== undefined) {
      this.setState({
        width: format.block_width,
        source: await getImageUrl(format.display_source, id),
      })
    } else if (properties !== undefined) {
      this.setState({
        source: await getImageUrl(properties.source[0][0], id),
      })
    }
  }

  public render(): React.ReactNode {
    const imageNode: React.ReactNode | null = this.renderImage()
    const captionNode: React.ReactNode | null = this.renderCaption()

    return (
      <FigureBlockContainer>
        {imageNode}
        {captionNode}
      </FigureBlockContainer>
    )
  }

  private renderImage = (): React.ReactNode | null => {
    const { source, width } = this.state
    if (source.length === 0) {
      return null
    }
    if (width >= 0) {
      return <Image width={width} src={source}/>
    }
    return <Image src={source}/>
  }

  private renderCaption = (): React.ReactNode | null => {
    const properties = this.props.value.properties
    if (properties !== undefined && properties.caption !== undefined) {
      return <FigureCaption caption={properties.caption}/>
    }
    return null
  }
}

const getImageUrl = async (url: string, id: string) => {
  if (url.match('/secure.notion-static.com/')) {
    const unsignedUrl: UnsignedUrl = {
      url,
      permissionRecord: {
        id,
        table: 'block',
      },
    }
    const signedFileUrls: SignedFileUrls = await api.getSignedFileUrls([unsignedUrl])
    if (
      signedFileUrls !== undefined &&
      signedFileUrls.signedUrls !== undefined &&
      signedFileUrls.signedUrls.length > 0
    ) {
      return signedFileUrls.signedUrls[0]
    }
  }
  return url
}

export default ImageBlock
