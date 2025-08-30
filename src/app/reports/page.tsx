import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ReportsContent from './ReportsContent';


export default function Reports() {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <Sidebar />
      <Header />
      <ReportsContent />
    </div>
  );
}
