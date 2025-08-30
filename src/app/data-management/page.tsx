import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DataManagementContent from './DataManagementContent';


export default function DataManagement() {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <Sidebar />
      <Header />
      <DataManagementContent />
    </div>
  );
}
