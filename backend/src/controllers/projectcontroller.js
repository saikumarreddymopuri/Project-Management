import { Project} from "../models/project.js";
import { Phase } from "../models/phase.js";


const createProject = async (req, res) => {
    const { projectId, projectName, teamLead } = req.body;
  
    const projectExists = await Project.findOne({ projectId });
  
    if (projectExists) {
      return res.status(400).json({ message: 'Project already exists' });
    }
  
    const project = await Project.create({ projectId, projectName, teamLead });
  
    if (project) {
      res.status(201).json(project);
    } else {
      res.status(400).json({ message: 'Invalid project data' });
    }
  };
  
  const getProjects = async (req, res) => {
    const projects = await Project.find({}).populate('phases');
    res.json(projects);
  };
  
  const getProjectById = async (req, res) => {
    const project = await Project.findById(req.params.id).populate('phases');
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  };


  const getPhasesByProjectId = async (req, res) => {
    const projectId = req.params.projectId;
  
    try {
      // Find the project by projectId
      const project = await Project.findById(projectId).populate('phases');
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Send the phases associated with the project
      res.json(project.phases);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  const removetheproject = async (req,res) => {
    const {projectId}=req.params;
    try{
      const deleteproject = await Project.findOneAndDelete({projectId:projectId});
      if(!deleteproject){
        return res.status(404).json({message:'project not found'});
      }
      res.status(200).json({message:'project deleted',deleteproject});
    }catch(error){
      res.status(500).json({message:'error fetchoing projects',error});
    }

  };

  export{removetheproject}
  const changeprojectdetails=async (req,res) => {
    const {projectName, teamLead} = req.body;
    try{
      const project = await Project.findById(req.params.id);
      if(project){
        project.projectName=projectName;
        project.teamLead=teamLead;
      }
      await project.save();
      res.status(201).json(project);
    }
    catch{
      res.status(400).json({ message: 'Invalid project data' });
    }
  };
  export{changeprojectdetails}
  export{createProject,getProjects,getProjectById,getPhasesByProjectId}


