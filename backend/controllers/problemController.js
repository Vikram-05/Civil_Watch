import Problem from "../models/Problem.js";
import User from '../models/User.js'
import dotenv from 'dotenv';
// import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET
});

export const createProblem = async (request, response) => {
    const { title, description, location, severity, state, district, wardNumber } = request.body;
    
    try {
        // Check if files were uploaded
        if (!request.files || Object.keys(request.files).length === 0) {
            return response.status(400).json({
                message: 'No files were uploaded.',
                success: false,
                error: true
            });
        }

        // Handle multiple file uploads
        const files = request.files.images;
        const uploadPromises = [];

        // If single file, convert to array for consistent processing
        const filesArray = Array.isArray(files) ? files : [files];

        // Upload each file to Cloudinary
        for (const file of filesArray) {
            const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'problem_reports'
            });
            uploadPromises.push(uploadResult.secure_url);
        }

        // Wait for all uploads to complete
        const imageUrls = await Promise.all(uploadPromises);

        // Create new problem with image URLs
        const problem = new Problem({
            user_id: request._id,
            title,
            description,
            location,
            images: imageUrls,
            severity,
            state,
            district,
            wardNumber,
            status: 'pending'
        });

        await problem.save();
        
        response.status(201).json({
            message: 'Problem reported successfully',
            problem,
            success: true,
            error: false
        });
    } catch (error) {
        console.error('Error creating problem:', error);
        response.status(500).json({ 
            message: error.message || 'Internal server error', 
            success: false, 
            error: true 
        });
    }
};



export const getProblem = async (request, response) => {

    try {
        const problemData = await Problem.find({ user_id: request.params.id })
        response.status(201).json({ message: 'Problem reported successfully', problemData: problemData, success: true, erroe: false });
    } catch (error) {
        response.status(500).json({ message: error.message, success: false, error: true });
    }

}
export const deleteProblem = async (request, response) => {

    try {
        const problemData = await Problem.findByIdAndDelete(request.params.id)
        response.status(201).json({ message: 'Problem reported successfully', problemData: problemData, success: true, erroe: false });
    } catch (error) {
        response.status(500).json({ message: error.message, success: false, error: true });
    }

}

export const representativeProblem = async (request, response) => {

    try {
        const RepData = await User.findById(request.params.id)
        response.status(201).json({ message: 'Problem reported successfully', RepData: RepData, success: true, erroe: false });
    } catch (error) {
        response.status(500).json({ message: error.message, success: false, error: true });
    }

}
export const problemUnderRep = async (request, response) => {
    // const { state, district, wardNumber } = request.query;

    try {
        const user = await User.findById(request.params.id);

        const { state, district, wardNumber } = user;

        const AllProblem = await Problem.find({ state, district, wardNumber })
        response.status(200).json({
            message: 'Problem reported successfully',
            AllProblemData: AllProblem,
            success: true,
            error: false,
        });

    } catch (error) {
        // If an error occurs, return a 500 status code and the error message
        response.status(500).json({
            message: error.message,
            success: false,
            error: true
        });
    }
};
export const problemUnderUser = async (request, response) => {
    const { state, district, wardNumber } = request.query;

    try {
        const query = {
            state: { $regex: state, $options: "i" },
            district: { $regex: district, $options: "i" }
        };

        // Only add wardNumber if it's a valid number
        if (wardNumber) {
            const wardNum = parseInt(wardNumber);
            if (!isNaN(wardNum)) {
                query.wardNumber = wardNum;
            } else {
                return response.status(400).json({
                    message: "Invalid wardNumber. Must be a number.",
                    success: false,
                    error: true
                });
            }
        }

        const AllProblem = await Problem.find(query);

        response.status(200).json({
            message: 'Problems fetched successfully',
            AllProblemData: AllProblem,
            success: true,
            error: false,
        });

    } catch (error) {
        response.status(500).json({
            message: error.message,
            success: false,
            error: true
        });
    }
};


export const getProblemData = async (request, response) => {

    try {

        const problemData = await Problem.findById(request.params.id)
        response.status(200).json({
            message: 'Problem reported successfully',
            data: problemData,
            success: true,
            error: false
        });

    } catch (error) {
        // If an error occurs, return a 500 status code and the error message
        response.status(500).json({
            message: error.message,
            success: false,
            error: true
        });
    }
};
export const updateStatus = async (request, response) => {

    try {
        const { status, assignTo_id } = request.body

        const problemData = await Problem.findById(request.params.id)
        const updatedata = { status, assignTo_id }
        const UPdatedData = await Problem.updateOne(problemData, updatedata)
        response.status(200).json({
            message: 'Problem reported successfully',
            updatedata: UPdatedData,
            data: problemData,
            success: true,
            error: false
        });

    } catch (error) {
        // If an error occurs, return a 500 status code and the error message
        response.status(500).json({
            message: error.message,
            success: false,
            error: true
        });
    }
};
export const updateIsSolved = async (request, response) => {

    try {
        const { isSolved } = request.body

        const problemData = await Problem.findById(request.params.id)
        const updatedata = { isSolved }
        const UPdatedData = await Problem.updateOne(problemData, updatedata)
        response.status(200).json({
            message: 'Problem reported successfully',
            updatedata: UPdatedData,
            data: problemData,
            success: true,
            error: false
        });

    } catch (error) {
        // If an error occurs, return a 500 status code and the error message
        response.status(500).json({
            message: error.message,
            success: false,
            error: true
        });
    }
};
export const updateUserReport = async (request, response) => {
    try {
        const problemId = request.params.id;

        // Find the problem by ID
        const problemData = await Problem.findById(problemId);

        if (!problemData) {
            return response.status(404).json({
                message: "Problem not found",
                success: false,
                error: true
            });
        }

        // Increment noOfPerson by 1
        problemData.noOfPerson = (problemData.noOfPerson || 0) + 1;

        // Save the updated document
        const updatedProblem = await problemData.save();

        response.status(200).json({
            message: 'You liked the report successfully',
            data: updatedProblem,
            success: true,
            error: false
        });

    } catch (error) {
        response.status(500).json({
            message: error.message,
            success: false,
            error: true
        });
    }
};
export const decrementLike = async (request, response) => {
    try {
        const problemId = request.params.id;

        // Find the problem by ID
        const problemData = await Problem.findById(problemId);

        if (!problemData) {
            return response.status(404).json({
                message: "Problem not found",
                success: false,
                error: true
            });
        }

        // Increment noOfPerson by 1
        problemData.noOfPerson = (problemData.noOfPerson || 0) - 1;

        // Save the updated document
        const updatedProblem = await problemData.save();

        response.status(200).json({
            message: 'Remove Like successfully',
            data: updatedProblem,
            success: true,
            error: false
        });

    } catch (error) {
        response.status(500).json({
            message: error.message,
            success: false,
            error: true
        });
    }
};

