import airportImage from '../assets/trip/place-airport.png'
import hotelImage from '../assets/trip/place-hotel.png'
import marketImage from '../assets/trip/place-market.png'
import cafeImage from '../assets/trip/place-cafe.png'
import dotonboriImage from '../assets/trip/place-dotonbori.png'

export type Place = {
  id: number
  name: string
  category: string
  detail: string
  note: string
  travel: string
  image: string
  fixed?: boolean
  added?: boolean
}

export type CandidatePlace = {
  id: number
  name: string
  category: string
  distance: string
  image: string
}

export const initialPlaces: Place[] = [
  {
    id: 1,
    name: '간사이 공항 도착',
    category: '항공',
    detail: '항공, 11:20 도착',
    note: '대한항공 · 입국 수속 후 이동해요',
    travel: '난카이선 45분 · 42km',
    image: airportImage,
    fixed: true,
  },
  {
    id: 2,
    name: 'APA 호텔 난바',
    category: '숙소',
    detail: '숙소, 오후',
    note: '짐 맡기고 잠시 쉬어가요',
    travel: '도보 5분 · 300m',
    image: hotelImage,
    fixed: true,
  },
  {
    id: 3,
    name: '구로몬 시장',
    category: '맛집',
    detail: '맛집, 늦은 점심',
    note: '해산물 꼬치와 과일 길거리 음식',
    travel: '지하철 8분 · 1.6km',
    image: marketImage,
  },
  {
    id: 4,
    name: '리로 커피 로스터스',
    category: '카페',
    detail: '카페, 오후',
    note: '취향에 맞게 고르는 스페셜티 커피',
    travel: '도보 6분 · 400m',
    image: cafeImage,
  },
  {
    id: 5,
    name: '도톤보리 저녁 식사',
    category: '맛집',
    detail: '맛집, 저녁',
    note: '강변에서 즐기는 오코노미야키',
    travel: '지하철 15분 · 4.2km',
    image: dotonboriImage,
  },
  {
    id: 6,
    name: '우메다 공중정원',
    category: '야경',
    detail: '야경, 밤',
    note: '엘리베이터로 오르는 전망대',
    travel: '도보 12분 · 800m',
    image: airportImage,
  },
]

export const relaxedPlaces: Place[] = [
  initialPlaces[0],
  initialPlaces[1],
  initialPlaces[2],
  {
    id: 7,
    name: '숙소에서 쉬는 시간',
    category: '휴식',
    detail: '휴식, 40분',
    note: '호텔 난바에서 잠시 쉬어가요',
    travel: '도보 3분 · 200m',
    image: hotelImage,
    added: true,
  },
  initialPlaces[4],
  initialPlaces[5],
]

export const addCandidates: CandidatePlace[] = [
  { id: 101, name: '오사카성', category: '관광', distance: '구로몬 시장에서 1.2km', image: airportImage },
  { id: 102, name: '이치란 라멘 도톤보리', category: '맛집', distance: '도톤보리에서 200m', image: hotelImage },
  { id: 103, name: 'HARBS 난바', category: '카페', distance: 'APA 호텔 난바에서 350m', image: marketImage },
  { id: 104, name: '신사이바시 쇼핑거리', category: '쇼핑', distance: '도톤보리에서 400m', image: cafeImage },
  { id: 105, name: '호젠지 요코초', category: '관광', distance: '도톤보리에서 300m', image: dotonboriImage },
]

export const replaceCandidates: CandidatePlace[] = [
  { id: 201, name: 'HARBS 난바', category: '카페', distance: '숙소에서 350m', image: hotelImage },
  { id: 202, name: '마루후쿠 커피 센니치마에', category: '카페', distance: '도톤보리에서 250m', image: marketImage },
  { id: 203, name: '릴로 커피 킷사', category: '카페', distance: '신사이바시에서 300m', image: cafeImage },
  { id: 204, name: '브루클린 로스팅 난바', category: '카페', distance: '난바역에서 400m', image: dotonboriImage },
]
