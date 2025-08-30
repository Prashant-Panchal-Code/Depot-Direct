"use client";

import { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  AllCommunityModule,
  ICellRendererParams,
} from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { CheckSquare, Circle, Rows, XCircle } from "@phosphor-icons/react";
import AddSiteDialog, { Site } from "../components/AddSiteDialog";
import SiteDetailsModal, { SiteDetails } from "../components/SiteDetailsModal";
import SiteDetailsPage from "../components/SiteDetailsPage";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export default function SitesContent() {
  const { sidebarCollapsed } = useAppContext();
  const [selectedSite, setSelectedSite] = useState<SiteDetails | null>(null);
  const [showSiteDetails, setShowSiteDetails] = useState(false);
  const [sites, setSites] = useState([
    { id: 1, siteCode: "WC001", siteName: "Downtown Gas Station", latLong: "34.0522, -118.2437", street: "123 Main Street", postalCode: "90210", town: "Los Angeles", active: true, priority: "High" },
    { id: 2, siteCode: "WC002", siteName: "Airport Fuel Hub", latLong: "34.0522, -118.2437", street: "456 Airport Blvd", postalCode: "90045", town: "Los Angeles", active: true, priority: "High" },
    { id: 3, siteCode: "WC003", siteName: "Industrial District Station", latLong: "34.0194, -118.4108", street: "789 Industrial Way", postalCode: "90401", town: "Santa Monica", active: true, priority: "Medium" },
    { id: 4, siteCode: "WC004", siteName: "Harbor Point Depot", latLong: "33.7701, -118.1937", street: "321 Harbor Drive", postalCode: "90731", town: "San Pedro", active: false, priority: "Low" },
    { id: 5, siteCode: "WC005", siteName: "Suburban Shopping Center", latLong: "34.1478, -118.1445", street: "654 Shopping Center Dr", postalCode: "91101", town: "Pasadena", active: true, priority: "Medium" },
    { id: 6, siteCode: "WC006", siteName: "Coastal Highway Station", latLong: "34.0059, -118.4989", street: "789 Pacific Coast Hwy", postalCode: "90401", town: "Santa Monica", active: true, priority: "High" },
    { id: 7, siteCode: "WC007", siteName: "Metro Center Fuel", latLong: "34.0522, -118.2437", street: "456 Metro Blvd", postalCode: "90012", town: "Los Angeles", active: true, priority: "Medium" },
    { id: 8, siteCode: "WC008", siteName: "Valley Express Station", latLong: "34.1684, -118.3731", street: "123 Valley View Dr", postalCode: "91367", town: "Woodland Hills", active: false, priority: "Low" },
    { id: 9, siteCode: "WC009", siteName: "Beverly Hills Premium", latLong: "34.0736, -118.4004", street: "321 Rodeo Drive", postalCode: "90210", town: "Beverly Hills", active: true, priority: "High" },
    { id: 10, siteCode: "WC010", siteName: "Venice Beach Station", latLong: "33.9850, -118.4695", street: "789 Ocean Front Walk", postalCode: "90291", town: "Venice", active: true, priority: "Medium" },
    { id: 11, siteCode: "WC011", siteName: "Hollywood Boulevard Fuel", latLong: "34.1022, -118.3406", street: "456 Hollywood Blvd", postalCode: "90028", town: "Hollywood", active: true, priority: "High" },
    { id: 12, siteCode: "WC012", siteName: "Culver City Station", latLong: "34.0211, -118.3965", street: "123 Washington Blvd", postalCode: "90232", town: "Culver City", active: false, priority: "Low" },
    { id: 13, siteCode: "WC013", siteName: "Marina Del Rey Fuel", latLong: "33.9803, -118.4517", street: "321 Admiralty Way", postalCode: "90292", town: "Marina Del Rey", active: true, priority: "Medium" },
    { id: 14, siteCode: "WC014", siteName: "El Segundo Airport Station", latLong: "33.9425, -118.4081", street: "789 Sepulveda Blvd", postalCode: "90245", town: "El Segundo", active: true, priority: "High" },
    { id: 15, siteCode: "WC015", siteName: "Manhattan Beach Express", latLong: "33.8847, -118.4109", street: "456 Manhattan Beach Blvd", postalCode: "90266", town: "Manhattan Beach", active: true, priority: "Medium" },
    { id: 16, siteCode: "WC016", siteName: "Redondo Beach Station", latLong: "33.8492, -118.3887", street: "123 Pacific Coast Hwy", postalCode: "90277", town: "Redondo Beach", active: false, priority: "Low" },
    { id: 17, siteCode: "WC017", siteName: "Torrance Industrial", latLong: "33.8358, -118.3406", street: "321 Torrance Blvd", postalCode: "90501", town: "Torrance", active: true, priority: "High" },
    { id: 18, siteCode: "WC018", siteName: "Long Beach Harbor", latLong: "33.7701, -118.1937", street: "789 Harbor Scenic Dr", postalCode: "90802", town: "Long Beach", active: true, priority: "High" },
    { id: 19, siteCode: "WC019", siteName: "Huntington Beach Pier", latLong: "33.6553, -117.9988", street: "456 Main Street", postalCode: "92648", town: "Huntington Beach", active: true, priority: "Medium" },
    { id: 20, siteCode: "WC020", siteName: "Newport Beach Station", latLong: "33.6189, -117.9298", street: "123 Balboa Blvd", postalCode: "92661", town: "Newport Beach", active: false, priority: "Low" },
    { id: 21, siteCode: "WC021", siteName: "Laguna Beach Scenic", latLong: "33.5427, -117.7854", street: "321 Coast Hwy", postalCode: "92651", town: "Laguna Beach", active: true, priority: "Medium" },
    { id: 22, siteCode: "WC022", siteName: "Anaheim Convention Center", latLong: "33.8073, -117.9185", street: "789 Katella Ave", postalCode: "92802", town: "Anaheim", active: true, priority: "High" },
    { id: 23, siteCode: "WC023", siteName: "Fullerton University Station", latLong: "33.8839, -117.8850", street: "456 State College Blvd", postalCode: "92831", town: "Fullerton", active: true, priority: "Medium" },
    { id: 24, siteCode: "WC024", siteName: "Buena Park Express", latLong: "33.8675, -117.9981", street: "123 Beach Blvd", postalCode: "90620", town: "Buena Park", active: false, priority: "Low" },
    { id: 25, siteCode: "WC025", siteName: "Cypress Industrial", latLong: "33.8169, -118.0373", street: "321 Lincoln Ave", postalCode: "90630", town: "Cypress", active: true, priority: "High" },
    { id: 26, siteCode: "WC026", siteName: "Garden Grove Station", latLong: "33.7739, -117.9414", street: "789 Harbor Blvd", postalCode: "92840", town: "Garden Grove", active: true, priority: "Medium" },
    { id: 27, siteCode: "WC027", siteName: "Westminster Express", latLong: "33.7514, -117.9940", street: "456 Bolsa Ave", postalCode: "92683", town: "Westminster", active: true, priority: "Low" },
    { id: 28, siteCode: "WC028", siteName: "Fountain Valley Station", latLong: "33.7092, -117.9537", street: "123 Brookhurst St", postalCode: "92708", town: "Fountain Valley", active: false, priority: "Medium" },
    { id: 29, siteCode: "WC029", siteName: "Costa Mesa Business", latLong: "33.6411, -117.9187", street: "321 Bristol St", postalCode: "92626", town: "Costa Mesa", active: true, priority: "High" },
    { id: 30, siteCode: "WC030", siteName: "Irvine Tech Center", latLong: "33.6846, -117.8265", street: "789 Jamboree Rd", postalCode: "92612", town: "Irvine", active: true, priority: "High" },
    { id: 31, siteCode: "WC031", siteName: "Mission Viejo Station", latLong: "33.6000, -117.6720", street: "456 Marguerite Pkwy", postalCode: "92692", town: "Mission Viejo", active: true, priority: "Medium" },
    { id: 32, siteCode: "WC032", siteName: "Lake Forest Express", latLong: "33.6469, -117.6892", street: "123 Lake Forest Dr", postalCode: "92630", town: "Lake Forest", active: false, priority: "Low" },
    { id: 33, siteCode: "WC033", siteName: "Aliso Viejo Station", latLong: "33.5676, -117.7256", street: "321 Aliso Creek Rd", postalCode: "92656", town: "Aliso Viejo", active: true, priority: "Medium" },
    { id: 34, siteCode: "WC034", siteName: "San Juan Capistrano", latLong: "33.5017, -117.6625", street: "789 Ortega Hwy", postalCode: "92675", town: "San Juan Capistrano", active: true, priority: "Low" },
    { id: 35, siteCode: "WC035", siteName: "Dana Point Harbor", latLong: "33.4734, -117.6981", street: "456 Pacific Coast Hwy", postalCode: "92629", town: "Dana Point", active: true, priority: "High" },
    { id: 36, siteCode: "WC036", siteName: "San Clemente Beach", latLong: "33.4270, -117.6120", street: "123 Avenida Del Mar", postalCode: "92672", town: "San Clemente", active: false, priority: "Medium" },
    { id: 37, siteCode: "WC037", siteName: "Oceanside Pier Station", latLong: "33.1959, -117.3795", street: "321 Mission Ave", postalCode: "92054", town: "Oceanside", active: true, priority: "High" },
    { id: 38, siteCode: "WC038", siteName: "Carlsbad Village", latLong: "33.1581, -117.3506", street: "789 Carlsbad Village Dr", postalCode: "92008", town: "Carlsbad", active: true, priority: "Medium" },
    { id: 39, siteCode: "WC039", siteName: "Encinitas Express", latLong: "33.0370, -117.2920", street: "456 Coast Hwy 101", postalCode: "92024", town: "Encinitas", active: true, priority: "Low" },
    { id: 40, siteCode: "WC040", siteName: "Solana Beach Station", latLong: "32.9911, -117.2712", street: "123 Lomas Santa Fe Dr", postalCode: "92075", town: "Solana Beach", active: false, priority: "Medium" },
    { id: 41, siteCode: "WC041", siteName: "Del Mar Racing", latLong: "32.9595, -117.2653", street: "321 Jimmy Durante Blvd", postalCode: "92014", town: "Del Mar", active: true, priority: "High" },
    { id: 42, siteCode: "WC042", siteName: "La Jolla Cove", latLong: "32.8470, -117.2730", street: "789 Prospect St", postalCode: "92037", town: "La Jolla", active: true, priority: "High" },
    { id: 43, siteCode: "WC043", siteName: "Pacific Beach Station", latLong: "32.7940, -117.2348", street: "456 Garnet Ave", postalCode: "92109", town: "Pacific Beach", active: true, priority: "Medium" },
    { id: 44, siteCode: "WC044", siteName: "Mission Beach Express", latLong: "32.7669, -117.2526", street: "123 Mission Blvd", postalCode: "92109", town: "Mission Beach", active: false, priority: "Low" },
    { id: 45, siteCode: "WC045", siteName: "Ocean Beach Station", latLong: "32.7481, -117.2470", street: "321 Newport Ave", postalCode: "92107", town: "Ocean Beach", active: true, priority: "Medium" },
    { id: 46, siteCode: "WC046", siteName: "Point Loma Naval", latLong: "32.6953, -117.2415", street: "789 Rosecrans St", postalCode: "92106", town: "Point Loma", active: true, priority: "High" },
    { id: 47, siteCode: "WC047", siteName: "Downtown San Diego", latLong: "32.7157, -117.1611", street: "456 Broadway", postalCode: "92101", town: "San Diego", active: true, priority: "High" },
    { id: 48, siteCode: "WC048", siteName: "Balboa Park Station", latLong: "32.7341, -117.1449", street: "123 Park Blvd", postalCode: "92103", town: "San Diego", active: false, priority: "Medium" },
    { id: 49, siteCode: "WC049", siteName: "Hillcrest Express", latLong: "32.7490, -117.1664", street: "321 University Ave", postalCode: "92103", town: "San Diego", active: true, priority: "Low" },
    { id: 50, siteCode: "WC050", siteName: "Chula Vista Station", latLong: "32.6401, -117.0842", street: "789 Broadway", postalCode: "91910", town: "Chula Vista", active: true, priority: "Medium" },
  ]);

  const handleAddSite = (newSite: Site) => {
    const site = {
      ...newSite,
      id: sites.length + 1,
      latLong: `${newSite.latitude}, ${newSite.longitude}`,
    };
    setSites([...sites, site]);
  };

  const handleRowDoubleClick = (data: any) => {
    const siteDetails: SiteDetails = {
      ...data,
      // Add mock additional details that would typically come from a database
      contactPerson: `Manager ${data.siteCode}`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `manager.${data.siteCode.toLowerCase()}@company.com`,
    };
    setSelectedSite(siteDetails);
    setShowSiteDetails(true);
  };

  const handleBackToSites = () => {
    setShowSiteDetails(false);
    setSelectedSite(null);
  };

  const handleSaveSite = (updatedSite: SiteDetails) => {
    setSites(sites.map(site => 
      site.id === updatedSite.id ? updatedSite : site
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Action Cell Renderer for Edit/Delete buttons
  const ActionCellRenderer = (params: ICellRendererParams) => {
    return (
      <div className="flex items-center gap-2 h-full">
        <Button size="sm" onClick={() => console.log("Edit", params.data)}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => console.log("Delete", params.data)}
        >
          Delete
        </Button>
      </div>
    );
  };

  // Status Cell Renderer for Active/Inactive
  const StatusCellRenderer = (params: ICellRendererParams) => {
    const isActive = params.value;
    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${
          isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  // Priority Cell Renderer
  const PriorityCellRenderer = (params: ICellRendererParams) => {
    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(
          params.value
        )}`}
      >
        {params.value}
      </span>
    );
  };

 

  // Column Definitions
  const columnDefs: ColDef[] = [
    {
      field: "siteName",
      headerName: "Site Name",
      flex: 1,
      minWidth: 200,
      cellStyle: { fontWeight: "bold" },
    },
    {
      field: "siteCode",
      headerName: "Site Code",
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: "Lat/Long",
      field: "latLong",
      flex: 1,
      minWidth: 150,
      sortable: false,
      filter: false,
      cellStyle: { textAlign: 'center' },
    },
    {
      field: "street",
      headerName: "Street",
      flex: 2,
      minWidth: 150,
      valueFormatter: (params) => params.value || "-",
    },
    {
      field: "postalCode",
      headerName: "Postal Code",
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => params.value || "-",
    },
    {
      field: "town",
      headerName: "Town",
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => params.value || "-",
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      minWidth: 100,
      cellRenderer: StatusCellRenderer,
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
      minWidth: 100,
      cellRenderer: PriorityCellRenderer,
    },
    {
      headerName: "Actions",
      cellRenderer: ActionCellRenderer,
      flex: 1,
      minWidth: 150,
      sortable: false,
      filter: false,
      pinned: "right",
    },
  ];

  // Grid options
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <>
      {showSiteDetails && selectedSite ? (
        <SiteDetailsPage
          site={selectedSite}
          onBack={handleBackToSites}
          onSave={handleSaveSite}
        />
      ) : (
        <main
          className={`pt-20 h-screen bg-gray-50 text-gray-900 overflow-hidden transition-all duration-300 ${
            sidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <div className="p-4 h-full flex flex-col">
            {/* Header with Stats and Add Button */}
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              {/* Stats Cards - Same height as button */}
              <div className="flex gap-3">
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
                  <span className="text-base"><Rows size={25} color="#02589d" weight="duotone" /></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-gray-900">
                      {sites.length}
                    </span>
                    <span className="text-xs text-gray-600">Total</span>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
                  <span className="text-base"><CheckSquare size={25} weight="duotone" color="green" /></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-green-600">
                      {sites.filter((s) => s.active).length}
                    </span>
                    <span className="text-xs text-gray-600">Active</span>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
                  <span className="text-base"><Circle size={25} color="red" weight="duotone" /></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-red-600">
                      {sites.filter((s) => s.priority === "High").length}
                    </span>
                    <span className="text-xs text-gray-600">High</span>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
                  <span className="text-base"><XCircle size={25} color="red" weight="duotone" /></span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-red-600">
                      {sites.filter((s) => !s.active).length}
                    </span>
                    <span className="text-xs text-gray-600">Inactive</span>
                  </div>
                </div>
              </div>

              {/* Add New Site Button */}
              <AddSiteDialog onSave={handleAddSite} />
            </div>

            {/* Sites Table - Takes remaining space */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex-1 overflow-hidden">
              <div style={{ height: "100%", width: "100%" }}>
                <AgGridReact
                  rowData={sites}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  animateRows={true}
                  pagination={true}
                  paginationPageSize={20}
                  rowHeight={55}
                  headerHeight={45}
                  suppressMenuHide={true}
                  theme={themeQuartz}
                  onRowDoubleClicked={(event) => handleRowDoubleClick(event.data)}
                  onGridReady={(params: GridReadyEvent) => {
                    params.api.sizeColumnsToFit();
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
