/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { HousePlug, LogOut, Menu, Search, ShoppingCart, UserCog } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser, resetToken } from "@/store/auth-slice";
import { shoppingViewHeaderMenuItems } from "@/config";
import { useEffect, useState } from "react";
// import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "@radix-ui/react-label";
import UserCartWrapper from "./cart-wrapper";


function MenuItems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  function handleNavigate(getCurrentMenuItem) {
    // console.log(getCurrentMenuItem, "getCurrentMenuItem from header");
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;
    // console.log(currentFilter, "currentFilter from header");

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        ):
     navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          <div className="flex items-center gap-2">
            {menuItem.label}
            {menuItem.id === "search" ? <Search className="h-5 w-5"/> : null}
          </div>
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.shopCart);

  const [openCartSheet, setOpenCartSheet] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems({ userId: user.id }));
    }
  }, [user?.id]);
  

  function handleLogout() {
    // dispatch(logoutUser());
    dispatch(resetToken());
    sessionStorage.clear();
    navigate("/auth/login");
  }

  // console.log(cartItems, "cartItems from header");
  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          className="w-56 p-4 pl-6 rounded-2xl border border-gray-200 shadow-lg"
        >
          <div className="flex flex-col justify-between h-48">
            <div>
              <DropdownMenuLabel>
                Logged in as {user?.userName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </div>

            <div className="flex flex-col gap-1 mt-auto">
              <DropdownMenuItem
                onClick={() => navigate("/shop/account")}
                className="flex items-center gap-2"
              >
                <UserCog className="h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">Ecommerce</span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>

          {/* SheetContent with fixed bottom content for mobile */}
          <SheetContent
            side="left"
            className="w-full max-w-xs flex flex-col justify-between"
          >
            <div className="mt-4">
              <MenuItems />
            </div>
            <div className="px-4 pb-4">
              <HeaderRightContent />
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;