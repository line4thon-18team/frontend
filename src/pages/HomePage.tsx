import { Link } from 'react-router'

function HomePage() {
  return (
    <main>
      <h1>DOTLO</h1>
      <Link to="/trips/new">여행 만들기</Link>
    </main>
  )
}

export default HomePage
