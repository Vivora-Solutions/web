import React, { useState } from 'react';
import { assets } from '../../../../assets/assets';
import EditableField from '../../../../components/EditableField/EditableField';

const DashBoardHeader = () => {
    const [salonTitle, setSalonTitle] = useState("Liyo Saloon");
    const [description, setDescription] = useState(
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."
    );
    const [salonCategory, setSalonCategory] = useState("Hair Salon");
    const [salonLogo, setSalonLogo] = useState(assets.salonLogo);

    const handleLogoChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setSalonLogo(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white rounded-2xl shadow-md">
            {/* Logo Section */}
            <div className="relative w-36 h-36 shrink-0">
                <img
                    src={salonLogo}
                    alt="Salon Logo"
                    className="w-full h-full object-cover rounded-full border border-gray-300"
                />
                <div className="absolute bottom-0 right-0">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                        id="logo-upload"
                    />
                    <label
                        htmlFor="logo-upload"
                        className="cursor-pointer bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-blue-700 transition"
                    >
                        ✏️ Edit Logo
                    </label>
                </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 w-full space-y-4">
                <div className="text-xl font-bold text-gray-800">
                    <EditableField value={salonTitle} onSave={setSalonTitle} />
                </div>

                <div className="text-sm text-gray-600">
                    <EditableField
                        value={salonCategory}
                        onSave={setSalonCategory}
                        isTextarea={true}
                        className="w-full"
                    />
                </div>

                <div className="text-sm text-gray-500">
                    <EditableField
                        value={description}
                        onSave={setDescription}
                        isTextarea={true}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default DashBoardHeader;