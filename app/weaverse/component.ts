
import type { HydrogenComponent } from '@weaverse/hydrogen'
import * as TestComponent from './components/hero-banner'
import * as HomeGridComponent from './components/home-grid-component'
import * as HomeGridItem from './components/home-grid-item'
import * as NewsComponents from './components/news-components'
import * as NewsItem from './components/new-item'
import * as PopularComponent from './components/popular-component'
import * as FeaturedCollection from './components/featured-collection'
import * as LinkSection from './components/link-section'
import * as LinkSectionVideo from './components/link-section-video'
import * as GridComponent from './components/grid'
import * as ScentFamily from './components/scent-family'
import * as Guarantee from './components/guarantee'
import * as Banner from './components/banner'
import * as Title from './components/title'
import * as Container from './components/container'
import * as VideoItem from './components/video'
import * as Heading from './components/heading'
import * as Card from './components/card'
import * as Newsletter from './components/newsletter'
import * as DoftgrupperHero from './components/doftgrupper/hero'
import * as DoftgrupperRelated from './components/doftgrupper/overview'
import { atoms } from './components/atoms/atoms'
import * as HighlightItem from './components/images/item'
import * as Highlights from './components/images'
import * as HighlightContent from './components/images/content-item'
import * as Divider from './components/divider'
import * as ImageDivider from './components/divider/image-divider'
import * as FAQItem from './components/faq/item'
import * as FAQ from './components/faq'
import * as BasicSection from './components/basic-section'
import * as ImageWithText from './components/image-with-text'
import * as ImageWithTextContent from './components/image-with-text/content'
import * as HTMLComponent from './components/html-component'
import * as TeamRecommendation from './components/team-recommendation'
import * as CarouselHeader from './components/carousel/carousel-header'
import * as Carousel from './components/carousel'
import * as Parfymguide from './components/parfymguide'
import * as ProductSlide from './components/carousel/product-slide'
import * as ProductList from './components/product-list/ProductList'

export const components: HydrogenComponent[] = [
    TestComponent,
    HomeGridComponent,
    HomeGridItem,
    NewsComponents,
    NewsItem,
    PopularComponent,
    FeaturedCollection,
    LinkSection,
    LinkSectionVideo,
    GridComponent,
    ScentFamily,
    Guarantee,
    Banner,
    Title,
    Container,
    VideoItem,
    Heading,
    Card,
    Newsletter,
    DoftgrupperHero,
    DoftgrupperRelated,
    HighlightItem,
    Highlights,
    HighlightContent,
    Divider,
    ImageDivider,
    FAQItem,
    FAQ,
    BasicSection,
    ImageWithText,
    ImageWithTextContent,
    HTMLComponent,
    TeamRecommendation,
    CarouselHeader,
    Carousel,
    Parfymguide,
    ...atoms,
    ProductSlide,
    ProductList,
]