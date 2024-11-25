const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const OrgRole = mongoose.model("OrgRole");
const UserRoles = mongoose.model("UserRoles");
const { roleConstant, adminRoles, roleProjection } = require("../../constants/roleConstant");

function getRolesByCodes(codeArr) {    
    return OrgRole.find({ code: codeArr }, roleProjection).then(roles => {        
        return roles;
    }).catch(err => {
        console.log("getRolesByCodes error: ", err);
        return [];
    });

}

function canAddRemoveMemberOrg(userRole) {    
    if (userRole && userRole.roles && userRole.roles.length > 0) {
        return getRolesByCodes(adminRoles).then(adRoles =>{            
            for(let i = 0; i< userRole.roles.length; i++){
                let item = userRole.roles[i];
                let foundItem = adRoles.find((x) => x._id.toString() == item.role.toString());
                if (foundItem) {                    
                    return true;
                }
            }

            return false;
        });
    } else {
        return false;
    }
}

exports.getMembers = (req, res, next) => {
    // next();
    // return;
    UserRoles.findOne({ _id: req.userData.userId })
        .then(userRole => {
            if (userRole) {

                var roleIds = userRole.roles.map(o => o.role);
                let query = { _id: roleIds }; //Select all roles in roleIds
                OrgRole.find(query).then(data => {
                    let pass = false;
                    data.forEach(element => {
                        if (element.code == roleConstant.CLASS_ADMIN ||
                            element.code == roleConstant.ORG_ADMIN ||
                            element.code == roleConstant.SYSTEM_ADMIN) {
                            pass = true;
                        }
                    });

                    if (pass) {
                        next();
                    } else {
                        return res.status(403).json({ message: "Don't have permission to get roles." });
                    }
                })
                    .catch((err) => {
                        console.log("getRoles error", err);
                        return res.status(400).json({ message: err.message });
                    });
            } else {
                return res.status(404).json({ message: "Role of the requested user not found. It seems there is no role assigned to this user at all." });
            }
        })
        .catch((err) => {
            console.log("getRoles error", err);
            return res.status(400).json({ message: err.message });
        });
};

//DOING
exports.addRemoveMember = (req, res, next) => {
    console.log("addMember req validator", req);

    if (req.body && req.body.organizationId && req.body.members && req.body.members.length > 0) {
        return UserRoles.findOne({ user: req.userData.userId }).then(role => {
            if(canAddRemoveMemberOrg(role)){
                console.log("OKOK");
                next();
                return;
            }else{
                return res.status(400).json({ message: "Does not have permission to add organization!" });    
            }
        }).catch(err=>{
            return res.status(500).json({ message: err.message });
        });

    }else{
        return res.status(400).json({ message: "Requested data is invalid!" });
    }    
}

exports.updateOrganization = (req, res, next) => {
    console.log("updateOrganization req validator", req);

    if (req.body && req.body.name && req.body.description && req.body.organizationId) {
        return UserRoles.findOne({ user: req.userData.userId }).then(role => {
            if(canAddRemoveMemberOrg(role)){                
                next();
                return;
            }else{
                return res.status(400).json({ message: "Does not have permission to update organization!" });    
            }
        }).catch(err=>{
            return res.status(500).json({ message: err.message });
        });
    }else{
        return res.status(400).json({ message: "Requested data is invalid!" });
    }    
}

  