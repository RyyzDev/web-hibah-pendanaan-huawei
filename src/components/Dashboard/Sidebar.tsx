import React from 'react';
import { IoMenu, IoClose, IoLogOutOutline, IoChevronDown, IoChevronUp } from 'react-icons/io5';

type SidebarItem = {
  key: string;
  icon: React.ElementType;
  label: string;
  children?: { key: string; label: string }[];
};

interface SidebarProps {
  isMobile: boolean;
  mobileOpen: boolean;
  sidebarOpen: boolean;
  handleToggleSidebar: () => void;
  handleCloseMobileOverlay: () => void;
  handleLogout: () => void;
  sidebarItems: SidebarItem[];
  expandedKeys: string[];
  activeTab: string;
  handleNavClick: (key: string, hasChildren: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobile,
  mobileOpen,
  sidebarOpen,
  handleToggleSidebar,
  handleCloseMobileOverlay,
  handleLogout,
  sidebarItems,
  expandedKeys,
  activeTab,
  handleNavClick
}) => {
  const sidebarClasses = [
    'dashboard-sidebar',
    !sidebarOpen && !isMobile ? 'collapsed' : '',
    isMobile && mobileOpen ? 'mobile-open' : '',
    isMobile && !mobileOpen ? 'collapsed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={handleCloseMobileOverlay}
      />

      {isMobile && (
        <button className="mobile-toggle-btn" onClick={handleToggleSidebar}>
          <IoMenu />
        </button>
      )}

      <aside className={sidebarClasses}>
        {!isMobile && (
          <button className="sidebar-toggle" onClick={handleToggleSidebar}>
            {sidebarOpen ? <IoClose /> : <IoMenu />}
          </button>
        )}
        {isMobile && (
          <button className="sidebar-toggle" onClick={handleToggleSidebar}>
            <IoClose />
          </button>
        )}

        <div className="sidebar-profile">
          <div className="sidebar-avatar">A</div>
          <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">Admin Panel</div>
            <div className="sidebar-profile-role">Administrator</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <div key={item.key} className="sidebar-item-container">
              <button
                className={`sidebar-item ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => handleNavClick(item.key, !!item.children)}
              >
                <span className="sidebar-item-icon"><item.icon /></span>
                <span className="sidebar-item-label">{item.label}</span>
                {item.children && (
                  <span className="sidebar-item-chevron">
                    {expandedKeys.includes(item.key) ? <IoChevronUp /> : <IoChevronDown />}
                  </span>
                )}
              </button>
              
              {item.children && expandedKeys.includes(item.key) && (sidebarOpen || isMobile) && (
                <div className="sidebar-subitems">
                  {item.children.map(child => (
                    <button
                      key={child.key}
                      className={`sidebar-subitem ${activeTab === child.key ? 'active' : ''}`}
                      onClick={() => handleNavClick(child.key, false)}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="sidebar-spacer" />
          <button className="sidebar-item logout" onClick={handleLogout}>
            <span className="sidebar-item-icon"><IoLogOutOutline /></span>
            <span className="sidebar-item-label">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
