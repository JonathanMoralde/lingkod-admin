"use client";

import { FaUser, FaEnvelope, FaFileAlt, FaBolt, FaHome } from "react-icons/fa";
import { NotificationData } from "./headerbar";
import { useRouter } from "next/navigation";

type Props = {
  notificationData: NotificationData;
  onClick: () => void;
};

const NotificationCard = ({ notificationData, onClick }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    switch (notificationData.type) {
      case "user":
        // revalidatecache
        router.push("/lingkod/residents");
        break;
      case "bill":
        // revalidatecache
        router.push("/lingkod/bill");
        break;
      case "request":
        // revalidatecache
        router.push("/lingkod/request");
        break;
      case "report":
        // revalidatecache
        router.push("/lingkod/reports");
        break;
      case "household":
        // revalidatecache
        router.push("/lingkod/household");
        break;

      default:
        break;
    }
    onClick();
  };
  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-4 cursor-pointer hover:bg-[#00000057] p-2"
    >
      <div className="text-white text-xl">
        {notificationData.type == "user" ? (
          <FaUser />
        ) : notificationData.type == "bill" ? (
          <FaBolt />
        ) : notificationData.type == "request" ? (
          <FaEnvelope />
        ) : notificationData.type == "report" ? (
          <FaFileAlt />
        ) : (
          <FaHome />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm line-clamp-2 text-ellipsis">
          {notificationData.notif_msg}
        </h3>

        <p className="italic text-gray-400 text-xs">
          {notificationData.timestamp}
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;
