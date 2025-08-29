import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DepotContent from './DepotContent';

export default function Depot() {
  return (
    <div className="bg-gray-900 text-white min-h-screen" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <Sidebar />
      <Header />
      <DepotContent />
    </div>
  );
}
