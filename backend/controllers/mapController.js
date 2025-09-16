import axios from 'axios';

export const getLocation = async (request, response) => {
    const { location } = request.query;
    console.log("location : ", location);

    if (!location || typeof location !== 'string' || location.trim() === '') {
        console.error("Error fetching address:");
        return response.status(400).json({
            success: false,
            message: 'Location query parameter is missing or invalid.',
            error: true,
        });
    }

    const coordinates = location.split(' ');
    if (coordinates.length !== 2 || isNaN(parseFloat(coordinates[0])) || isNaN(parseFloat(coordinates[1]))) {
        console.error("Error fetching address2:");
        return response.status(400).json({
            success: false,
            message: 'Invalid location format. Please provide latitude and longitude separated by a space.',
            error: true,
        });
    }

    const latitude = parseFloat(coordinates[0]);
    const longitude = parseFloat(coordinates[1]);

    try {
        // Construct the Nominatim URL
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

        // Make the request to Nominatim API
        const { data } = await axios.get(url);
        // console.log(data)
        let resData = {};
        if (data && data.address) {
            resData = {
                state: data.address.state || null,
                distric: (data.address.state_district || '').split(' ')[0] || null,
                pincode: data.address.postcode || null,
            };
        }
        // console.log("data : ",resData)

        // Check if the API response contains the address
        if (data && data.display_name) {
            response.status(200).json({
                data: resData,
                success: true,
                message: 'Location data fetched successfully',
                address: data.display_name,
                error: false
            });
        } else {
            response.status(404).json({
                success: false,
                message: 'Address not found for the given coordinates.',
                error: true
            });
        }

    } catch (error) {
        console.error("Error fetching address:", error);
        response.status(500).json({
            message: error.message,
            success: false,
            error: true
        });
    }
};