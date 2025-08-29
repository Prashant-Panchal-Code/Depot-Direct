import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import UsersContent from './UsersContent';


export default function Users() {
  return (
    <div className="bg-gray-900 text-white min-h-screen" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <Sidebar />
      <Header />
      <UsersContent />
    </div>
  );
}
