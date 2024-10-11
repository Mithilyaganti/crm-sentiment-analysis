import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feedback from './pages/Feedback'
import Admin from './pages/Admin'

export default function App() {
  return (
	<Router>
		<Routes>
			<Route path="/feedback" element={<Feedback />}>
			<Route path="/admin" element={<Admin />}/>
		</Routes>
	</Router>
  )
}
