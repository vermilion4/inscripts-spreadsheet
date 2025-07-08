import React, { useState } from 'react';
import logo from '../assets/sidebar.svg';
import arrow from '../assets/carat-right.svg';
import ellipsis from '../assets/ellipsis.svg';
import bell from '../assets/bell.svg';
import avatar from '../assets/avatar.png';
import search from '../assets/search.svg';
import Tooltip from '../ui/Tooltip';
import Dropdown from '../ui/Dropdown';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { ellipsisMenuItems, notifications } from '../constants/Header';

const Header = () => {
  const [activePath, setActivePath] = useState('spreadsheet');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const notificationItems = notifications.map(notification => ({
    id: notification.id,
    label: notification.text,
    onClick: () => handleNotificationClick(notification.id.toString()),
  }));

  const handleNotificationClick = (id: string) => {
    alert(`User interacted with notification: ${id}`);
  };

  const handleBreadcrumbClick = (path: string) => {
    setActivePath(path);
    alert(`Navigation occurred: ${activePath} to ${path}`);
  };

  const toggleSearch = () => {
    setIsMobileMenuOpen(false);
    setIsSearchExpanded(!isSearchExpanded);
  };

  const toggleMobileMenu = () => {
    setIsSearchExpanded(false);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (value: string) => {
    alert(`Search performed: ${value}`);
  };

  const handleProfileClick = () => {
    alert('Profile interaction');
  };

  return (
    <>
      <header
        className={`h-14 px-4 py-2 bg-white flex items-center ${isSearchExpanded || isMobileMenuOpen ? '' : 'border-b'} border-borderTertiary relative `}
      >
        <div className="flex items-center justify-between w-full gap-2 lg:gap-4">
          {/* Left Section - Logo and Breadcrumb */}
          <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
            <img src={logo} alt="logo" className="flex-shrink-0" />

            {/* Desktop Breadcrumb */}
            <div className="hidden lg:flex items-center gap-2 text-sm leading-tight font-medium min-w-0">
              <span
                className={`cursor-pointer whitespace-nowrap ${activePath === 'workspace' ? 'text-primary' : 'text-disabledPrimary'}`}
                onClick={() => handleBreadcrumbClick('workspace')}
              >
                Workspace
              </span>
              <img src={arrow} alt="arrow" className="flex-shrink-0" />
              <span
                className={`cursor-pointer whitespace-nowrap ${activePath === 'folder' ? 'text-primary' : 'text-disabledPrimary'}`}
                onClick={() => handleBreadcrumbClick('folder')}
              >
                Folder 2
              </span>
              <img src={arrow} alt="arrow" className="flex-shrink-0" />
              <span
                className={`cursor-pointer whitespace-nowrap ${activePath === 'spreadsheet' ? 'text-primary' : 'text-disabledPrimary'}`}
                onClick={() => handleBreadcrumbClick('spreadsheet')}
              >
                Spreadsheet 3
              </span>
              <Dropdown
                trigger={
                  <img
                    src={ellipsis}
                    alt="ellipsis"
                    className="ml-2 cursor-pointer flex-shrink-0"
                  />
                }
                items={ellipsisMenuItems}
                position="bottom"
                width="w-48"
              />
            </div>

            {/* Mobile/Tablet Breadcrumb - Simplified */}
            <div className="flex lg:hidden items-center gap-2 text-sm leading-tight font-medium min-w-0 flex-1">
              <span
                className={`cursor-pointer truncate ${activePath === 'spreadsheet' ? 'text-primary' : 'text-disabledPrimary'}`}
                onClick={() => handleBreadcrumbClick('spreadsheet')}
              >
                Spreadsheet 3
              </span>
              <Dropdown
                trigger={
                  <img
                    src={ellipsis}
                    alt="ellipsis"
                    className="ml-1 cursor-pointer flex-shrink-0"
                  />
                }
                items={ellipsisMenuItems}
                position="bottom"
                width="w-40"
              />
            </div>
          </div>

          {/* Right Section - Actions and Profile */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search - Responsive */}
            <div className="hidden md:flex items-center gap-2 bg-secondary rounded-md p-3 h-10 border border-borderSecondary">
              <img
                src={search}
                alt="search"
                className="w-4 h-4 flex-shrink-0"
              />
              <input
                type="text"
                placeholder="Search within sheet"
                className="bg-transparent border-none outline-none text-xs text-tertiary placeholder:text-tertiary w-[120px] xl:w-[160px]"
                onChange={e => handleSearch(e.target.value)}
              />
            </div>

            {/* Mobile Search Button */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-secondary transition-colors"
              onClick={toggleSearch}
            >
              <FiSearch className="w-5 h-5 text-tertiary" />
            </button>

            {/* Notifications */}
            <Dropdown
              trigger={
                <div className="relative flex items-center h-10">
                  <button className="relative flex items-center justify-center h-full w-10 rounded-md hover:bg-secondary transition-colors">
                    <img src={bell} alt="notifications" className="w-5 h-5" />
                    <span className="absolute top-0.5 right-1 bg-default text-secondary text-xxs rounded-full w-4 h-4 flex items-center justify-center leading-none [outline:2px_solid_white]">
                      {notifications.length}
                    </span>
                  </button>
                </div>
              }
              items={notificationItems}
              position="bottom"
              width="w-80"
            />

            {/* Profile - Responsive */}
            <Tooltip
              content="john.doe@example.com"
              position="bottom"
              className="hidden sm:block"
            >
              <div className="flex items-center gap-2 h-10">
                <img
                  src={avatar}
                  alt="profile"
                  className="w-7 h-7 rounded-full cursor-pointer flex-shrink-0"
                  onClick={handleProfileClick}
                />
                <div className="max-w-14 xl:max-w-20">
                  <p className="text-xs text-primary leading-none">John Doe</p>
                  <p className="truncate text-xxs text-tertiary leading-none mt-0.5">
                    john.doe@example.com
                  </p>
                </div>
              </div>
            </Tooltip>

            {/* Mobile Menu Button */}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-secondary transition-colors sm:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <FiX className="w-5 h-5 text-tertiary" />
              ) : (
                <FiMenu className="w-5 h-5 text-tertiary" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {isSearchExpanded && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-white border-b border-borderTertiary p-4 z-50">
          <div className="flex items-center gap-2 bg-secondary rounded-md p-3 h-10 border border-borderSecondary">
            <img src={search} alt="search" className="w-4 h-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search within sheet"
              className="bg-transparent border-none outline-none text-xs text-tertiary placeholder:text-tertiary flex-1"
              onChange={e => handleSearch(e.target.value)}
              autoFocus
            />
            <button
              onClick={toggleSearch}
              className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-white transition-colors"
            >
              <FiX className="w-4 h-4 text-tertiary" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-14 left-0 right-0 bg-white border-b border-borderTertiary z-50">
          <div className="p-4 space-y-4">
            {/* Profile Section */}
            <div className="flex items-center gap-3 pb-4 border-b border-borderTertiary">
              <img
                src={avatar}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-primary">John Doe</p>
                <p className="text-xs text-tertiary">john.doe@example.com</p>
              </div>
            </div>

            {/* Full Breadcrumb on Mobile */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-medium text-tertiary uppercase tracking-wider">
                Navigation
              </h3>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span
                  className={`cursor-pointer ${activePath === 'workspace' ? 'text-primary' : 'text-disabledPrimary'}`}
                  onClick={() => {
                    handleBreadcrumbClick('workspace');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Workspace
                </span>
                <img src={arrow} alt="arrow" className="w-3 h-3" />
                <span
                  className={`cursor-pointer ${activePath === 'folder' ? 'text-primary' : 'text-disabledPrimary'}`}
                  onClick={() => {
                    handleBreadcrumbClick('folder');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Folder 2
                </span>
                <img src={arrow} alt="arrow" className="w-3 h-3" />
                <span
                  className={`cursor-pointer ${activePath === 'spreadsheet' ? 'text-primary' : 'text-disabledPrimary'}`}
                  onClick={() => {
                    handleBreadcrumbClick('spreadsheet');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Spreadsheet 3
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
