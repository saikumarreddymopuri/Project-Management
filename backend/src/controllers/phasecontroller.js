import { Project} from "../models/project.js";
import { Phase } from "../models/phase.js";



const getProjectIdByIdentifier = async (req, res) => {
  const { projectId } = req.params; // This could be projectId or another field

  try {
      const project = await Project.findOne({ projectId: projectId });
      if (!project) return res.status(404).json({ message: 'Project not found' });
      res.json({ _id: project._id,projectId:project.projectId ,projectName:project.projectName,teamLead:project.teamLead,phases:project.phases });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getphasebyid=async (req, res) => {
  try {
      const { phaseId } = req.params;
      const phase = await Phase.findById(phaseId);

      if (!phase) {
          return res.status(404).json({ message: 'Phase not found' });
      }

      res.status(200).json(phase);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
};

const getverifiedforphase=async (req, res) => {
  const { phaseId } = req.params;

  try {
      const phase = await Phase.findById(phaseId);
      if (!phase) {
          return res.status(404).json({ message: 'Phase not found' });
      }

      // Mark the phase as verified
      phase.verified = true;
      await phase.save();

      res.json({ message: 'Phase verified successfully', phase });
  } catch (error) {
      res.status(500).json({ message: 'Error verifying phase' });
  }
}

export{getverifiedforphase};
export{getphasebyid};

export { getProjectIdByIdentifier };

const createPhase = async (req, res) => {
  const { phases} = req.body;
   // expecting an array of phases
   const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if(project){
    const createdPhases = await Phase.insertMany(phases.map(phase => ({
      name: phase.name,
      monitor: phase.monitor,
      status: 'not started',
      deadline: phase.deadline,
    })));

    project.phases.push(...createdPhases.map(phase => phase._id));
    await project.save();

    res.status(201).json(createdPhases);}
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const verifyfordocument=async(req,res)=>{
  const { id } = req.params;
    try {
        const updatedPhase = await Phase.findByIdAndUpdate(
            id,
            { isVerified: true }, // Set the verification status to true
            { new: true }
        );
        res.status(200).json(updatedPhase);
    } catch (error) {
        res.status(500).json({ message: 'Error verifying the report' });
    }
};
// Controller to update phase status
const updatePhaseStatus = async (req, res) => {
  const { status, completionDate } = req.body;

  try {
    const phase = await Phase.findById(req.params.id);

    if (phase) {
      phase.status = status;
      phase.completionDate = completionDate;

      if (completionDate) {
        const completionDateObj = new Date(completionDate);
        const deadlineObj = new Date(phase.deadline);

        // Calculate time difference
        const timeDifferenceMs = completionDateObj - deadlineObj;
        const absTimeDifferenceMs = Math.abs(timeDifferenceMs);
        const timeDifferenceDays = Math.floor(absTimeDifferenceMs / (1000 * 60 * 60 * 24));
        const timeDifferenceHours = Math.floor((absTimeDifferenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const timeDifferenceMinutes = Math.floor((absTimeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60));

        if (completionDateObj < deadlineObj) {
          phase.isOnTime = true;
          phase.timeDifference = `${timeDifferenceDays} days ${timeDifferenceHours} hours ${timeDifferenceMinutes} minutes early`;
        } else if (completionDateObj > deadlineObj) {
          phase.isOnTime = false;
          phase.timeDifference = `${timeDifferenceDays} days ${timeDifferenceHours} hours ${timeDifferenceMinutes} minutes delay`;
        } else {
          phase.isOnTime = true;
          phase.timeDifference = 'On time';
        }
      } else {
        // If no completionDate is provided, assume it's not completed yet
        phase.isOnTime = null; // Or some default value indicating no update
        phase.timeDifference = null;
      }

      await phase.save();
      res.json(phase);
    } else {
      res.status(404).json({ message: 'Phase not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const updatephasename =async (req, res) => {
  const { monitor } = req.body;

  try {
    const phase = await Phase.findById(req.params.id);
  

    if (phase) {
      phase.monitor=monitor;

      await phase.save();
      res.json(phase);
    } else {
      res.status(404).json({ message: 'Phase not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export { createPhase, updatephasename,updatePhaseStatus,verifyfordocument };
