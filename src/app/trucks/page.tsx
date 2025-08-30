import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TrucksContent from './TrucksContent';


export default function Trucks() {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <Sidebar />
      <Header />
      <TrucksContent />
    </div>
  );
}
