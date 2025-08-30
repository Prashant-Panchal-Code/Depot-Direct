import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DepotContent from './DepotContent';

export default function DepotPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <DepotContent />
      </div>
    </div>
  );
}
