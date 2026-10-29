import { Link } from 'react-router'

function TripCreatePage() {
  return (
    <main>
      <h1>여행 만들기</h1>
      <Link to="/trips/plan">일정 화면으로</Link>
    </main>
  )
}

export default TripCreatePage
