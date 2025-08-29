import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SitesContent from './SitesContent';

export default function Sites() {
  return (
    <div className="bg-gray-900 text-white min-h-screen" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <Sidebar />
      <Header />
      <SitesContent />
    </div>
  );
}
