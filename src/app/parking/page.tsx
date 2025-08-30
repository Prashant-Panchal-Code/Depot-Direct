import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ParkingContent from './ParkingContent';


export default function ParkingPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <ParkingContent />
      </div>
    </div>
  );
}
