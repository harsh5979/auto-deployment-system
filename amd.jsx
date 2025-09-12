import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import { AiOutlineMenu, AiFillHome } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { RiAiGenerate } from "react-icons/ri";
import { LiaUserTimesSolid } from "react-icons/lia";
import { FaRegCalendarTimes } from "react-icons/fa";
import { useAuthStore } from "../stores/authStore";
// import { useAdminStore } from "../../store/AdminStore";
import { GraduationCap, LogIn, LogInIcon, LogOut, LogOutIcon, User, Users } from "lucide-react";

const Navbar = () => {

  const { isAuthenticated } = useAuthStore()
  // const { downloadAllStudents, downloadBasicStudents } = useAdminStore()
  const navigate = useNavigate();

  const Service = [

    {
      name: "Temporary Student",
      link: "/admin/temporarystudents",
      logo: <FaRegCalendarTimes size={20} />,
    },
    {
      name: "Discontinued Student",
      link: "/admin/discontinuedstudents",
      logo: <LiaUserTimesSolid size={20} />,
    },
    {
      name: "Add Student",
      link: "/admin/addstudent",
      logo: <IoMdAdd size={20} />,
    },

    {
      name: "Add Monthly Fees",
      link: "/admin/add-monthly-fees",
      logo: <AiOutlineMenu />,
    }, {
      name: "Staff Dashboard",
      link: "/admin/staff-dashboard",
      logo: <Users />,
    },
    {
      name: "Generate Fee Collection Report",
      link: "/admin/generate-fees-collection-report",
      logo: <RiAiGenerate size={25} />,
    },
    {
      name: "Download Student Details",
      link: "#",
      logo: <AiOutlineMenu />,
      onClick: () => downloadAllStudents(),
    },
    {
      name: "Download Blank Student Details",
      link: "#",
      logo: <AiOutlineMenu />,
      onClick: () => downloadBasicStudents(),
    },
  ];

  const [isSticky, setisSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setisSticky(window.scrollY > 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const [dropDownVisible, setDropDownVisible] = useState(false);
  const toggleDropDown = () => {
    setDropDownVisible(!dropDownVisible);
  };

  const handleAboutClick = async (e) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      const aboutSection = document.getElementById("about-section");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
  };
  const handleContactClick = async (e) => {
    e.preventDefault();
    navigate("/");

    // Add a slight delay before scrolling to the contact section
    setTimeout(() => {
      const contactSection = document.getElementById("contact-section");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 200);
  };

  return (
    <nav
      className={`flex flex-row justify-between {bg-[#0a131d]} w-full bg select-none mb-1 z-20  ${isSticky ? "sticky top-0 z-10" : ""
        } lg:h-[9vh] md:h-[9vh] h-[9vh] my-auto items-center shadow-lg shadow-[#191a26a7]`}
    >
      <div className="text-center mx-2 w-[200px]  ">
        <NavLink className="removeLinkHover p-0 h-0 " to="/" >
          <h2 className=" cursor-pointer bg-gradient-to-r from-yellow-400 to-yellow-900 bg-clip-text text-transparent font-bold hover:from-yellow-900 hover:to-yellow-400 text-xl  ">
            E-Mess Modasa
          </h2>
        </NavLink>
      </div>
      <div className="lg:hidden mx-2">
        <img
          className="invert-1 p-2 cursor-pointer mx-1"
          src={menuOpen ? "/img/close.svg" : "/img/hamburger.svg"}
          onClick={toggleMenu}
          alt="menu"
        />
      </div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${menuOpen
          ? "lg:opacity-0 opacity-100 "
          : "opacity-0 pointer-events-none"
          }`}
        onClick={toggleMenu}
      ></div>
      <div
        className={`humbar fixed z-50 md:top-[9vh] top-[10vh] lg:top-0 right-0 h-full   w-full     text-white transform ${menuOpen ? "translate-x-0 " : "translate-x-full "
          } transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:flex lg:items-center`}
      >
        <ul className="flex flex-col   lg:flex-row lg:items-center     lg:bg-transparent bg-[#0a131d] lg:w-full     ">
          <div className=" lg:flex gap-4 lg: md:mx-1      lg:w-full justify-center ">
            <li className="p-4 lg:p-0">
              <NavLink
                to="/"
                className={(e) =>
                  `block lg:inline-block py-2 px-4 font-bold hover:bg-gray-700 md:hover:bg-transparent ${e.isActive
                    ? "text-[#61C408]  after:w-[100%] after:bg-[#73a6e1]"
                    : ""
                  }`
                }
                onClick={toggleMenu}
              >
                HOME
              </NavLink>
            </li>
           
            {isAuthenticated  && (
              <li className="p-4 md:p-0 relative lg:hidden block">
                <button
                  onClick={toggleDropDown}
                  className="flex  font-bold items-center  ml-4 w-full lg:w-auto hover:bg-gray-700 lg:hover:bg-transparent"
                >
                  SERVICES
                  <FaAngleDown
                    className={`ml-5 transform ${dropDownVisible ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <ul
                  className={`lg:absolute lg:bg-gray-900 h-[200px] overflow-scroll lg:rounded-lg lg:shadow-lg lg:mt-2 p-2 lg:p-0 ${dropDownVisible ? "block" : "hidden"
                    }`}
                >
                  {Service.map((service) => (
                    <li
                      key={service.name}
                      className="border-t border-gray-700 lg:border-0"
                    >
                      {service.onClick ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            service.onClick(),
                              toggleMenu()
                          }}
                          className="block w-full text-left py-2 px-4 hover:bg-gray-700 lg:hover:bg-transparent"
                        >
                          {service.name}
                        </button>
                      ) : (
                        <NavLink
                          to={service.link}
                          className={(e) =>
                            `block py-2 px-4 hover:bg-gray-700 md:hover:bg-transparent ${e.isActive
                              ? "text-[#61C408]  after:w-[100%] after:bg-[#73a6e1]"
                              : ""
                            }`
                          }
                          onClick={toggleMenu}
                        >
                          {service.name}
                        </NavLink>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            )}
            <li className="p-4 md:p-0">
              <NavLink
                to="/about"
                className={(e) =>
                  `block md:inline-block font-bold py-2 px-4 hover:bg-gray-700 md:hover:bg-transparent ${e.isActive ? "  after:w-[100%] after:bg-[#73a6e1]" : ""
                  }`
                }
                onClick={toggleMenu}
              >
                <div onClick={handleAboutClick} className="cursor-pointer">
                  ABOUT
                </div>
              </NavLink>
            </li>
            <li className="p-4 md:p-0">
              <NavLink
                to="/contact"
                className={(e) =>
                  `block md:inline-block py-2 px-4 hover:bg-gray-700 md:hover:bg-transparent ${e.isActive
                    ? "text-[#61C408]  after:w-[100%] after:bg-[#73a6e1]"
                    : ""
                  }`
                }
                onClick={toggleMenu}
              >
                <div
                  onClick={handleContactClick}
                  className="c font-bold"
                >
                  CONTACT US
                </div>
              </NavLink>
            </li>
          </div>
          <div className=" mr-5 lg:w-auto flex lg:justify-end  items-center justify-center w-full ">
            <li className="p-4 lg:p-0 w-full  ">
              {isAuthenticated ? (
                <NavLink
                  to="/logout"
                  className=" removeLinkHover w-full flex sm:py-1 py-2 gap-1  bg-red-500 text-white  rounded-md "
                  onClick={toggleMenu}
                  >
                  <LogOutIcon/>
                  <span className="text-white  flex">
                Logout
                  </span>
                </NavLink>
              ) : (

                <div className=" flex flex-col gap-2  lg:flex-row ">
                  <NavLink
                    to="/adminlogin"
                    className="removeLinkHover w-full flex gap-2  sm:py-1 py-2 rounded-md justify-center  items-center  @bg-[#1b2a44] bg-slate-800 text-white   "
                    onClick={toggleMenu}
                  >
                    <User />
                    <span className="block sm:hidden w-full ">
                      Admin 
                    </span>

                  </NavLink>
                  <NavLink
                    to="/studentlogin"
                    className=" removeLinkHover w-full flex  gap-2 sm:py-1 py-2 items-center rounded-md   @bg-[#1b2a44] bg-slate-800 text-white hover:text-white   mt-2 md:mt-0 md:ml-2"
                    onClick={toggleMenu}
                  >
                    <GraduationCap  />
                    <span className="block sm:hidden w-full">
                      Student
                    </span>

                  </NavLink>
                </div>
              )}
            </li>
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
