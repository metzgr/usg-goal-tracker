import Avatars from 'src/components/custom/avatars';

export default function CardFooter({ orgFullName, orgAcronym, avatar1, avatar2, avatar3, avatar4 }) {
    const avatars = [avatar1, avatar2, avatar3, avatar4];
    const ownerCount = avatars.filter(avatar => avatar).length;

    return (
      <div className="py-4">
        <hr className="border-t-1 border-gray-200 mx-[1px]">
        </hr>
        <div className="flex justify-between items-center mt-3 mx-5">

<div><p className="text-sm font-semibold text-gray-900">{orgAcronym}</p>
<p className="text-xs text-gray-600">{orgFullName}</p></div>
<Avatars count={ownerCount} avatar1={avatar1} avatar2={avatar2} avatar3={avatar3} avatar4={avatar4} />
        </div>
      </div>
    );
  }