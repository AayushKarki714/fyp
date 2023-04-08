"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminInvitationRequestHandler = exports.handleUpdateInvitationStatus = exports.appointAsAdmin = exports.deleteMember = exports.getAllMembers = exports.checkIfEmailAvailable = exports.handleAddMembers = exports.handleUpdateWorkspaceTitle = exports.handleDeleteWorkspace = exports.handleGetWorkspace = exports.handleCreateWorkspace = void 0;
const path_1 = __importDefault(require("path"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const checkIfUserIdMatches_1 = __importDefault(require("../utils/checkIfUserIdMatches"));
const verifyRole_1 = __importDefault(require("../utils/verifyRole"));
const client_1 = require("@prisma/client");
const api400Error_1 = __importDefault(require("../utils/api400Error"));
function handleCreateWorkspace(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, lancerValues, clientValues, adminId } = req.body;
        (0, checkIfUserIdMatches_1.default)(req, adminId);
        const files = req.files;
        const file = files[Object.keys(files)[0]];
        const filePath = path_1.default.join(__dirname, "..", "..", "public", file.name);
        file.mv(filePath, (err) => {
            if (err)
                return res.status(400).json({ message: "Invalid Logo" });
        });
        const newWorkspace = yield prisma_1.default.workspace.create({
            data: {
                name,
                logo: `http://localhost:8000/${file.name}`,
                adminId,
            },
        });
        const lancers = JSON.parse(lancerValues).map((lancerEmail) => __awaiter(this, void 0, void 0, function* () {
            const val = yield prisma_1.default.user.findUnique({
                where: { email: lancerEmail },
            });
            return { userId: val === null || val === void 0 ? void 0 : val.id, role: "LANCER", workspaceId: newWorkspace.id };
        }));
        const clients = JSON.parse(clientValues).map((clientEmail) => __awaiter(this, void 0, void 0, function* () {
            const val = yield prisma_1.default.user.findUnique({
                where: { email: clientEmail },
            });
            return { userId: val === null || val === void 0 ? void 0 : val.id, role: "CLIENT", workspaceId: newWorkspace.id };
        }));
        const lancersData = yield Promise.all(lancers);
        const clientsData = yield Promise.all(clients);
        const adminData = {
            userId: adminId,
            role: "ADMIN",
            workspaceId: newWorkspace.id,
        };
        const membersData = lancersData.concat(clientsData).concat(adminData);
        console.log({ membersData });
        const members = yield prisma_1.default.$transaction(membersData.map((memberData) => prisma_1.default.member.create({ data: Object.assign({}, memberData) })));
        console.log({ members });
        const allChat = yield prisma_1.default.chat.create({
            data: {
                workspaceId: newWorkspace.id,
                type: "ALL",
            },
        });
        const lancersAndAdminChat = yield prisma_1.default.chat.create({
            data: {
                workspaceId: newWorkspace.id,
                type: "LANCERS",
            },
        });
        const clientsAndAdminChat = yield prisma_1.default.chat.create({
            data: {
                workspaceId: newWorkspace.id,
                type: "CLIENTS",
            },
        });
        const adminMember = members.find((member) => member.role === client_1.Role.ADMIN);
        const invitations = yield prisma_1.default.$transaction(members.map((member) => prisma_1.default.invitation.create({
            data: {
                senderId: adminMember.id,
                recieverId: member.id,
                message: member.id === adminMember.id
                    ? `You created a Workspace named ${newWorkspace.name} Successfully`
                    : `You are invited as a ${member.role} in ${newWorkspace.name}`,
                status: member.id === adminMember.id
                    ? client_1.InvitationStatus.ACCEPTED
                    : client_1.InvitationStatus.PENDING,
                workspaceId: newWorkspace.id,
            },
            include: {
                reciever: true,
                sender: true,
            },
        })));
        yield prisma_1.default.$transaction(invitations.map((invitation) => prisma_1.default.notification.create({
            data: {
                message: invitation.message,
                invitationId: invitation.id,
                recieverId: invitation.reciever.userId,
                senderId: invitation.sender.userId,
                type: invitation.reciever.userId === (invitation === null || invitation === void 0 ? void 0 : invitation.sender.userId)
                    ? client_1.NotificationType.INVITATION_CREATOR
                    : client_1.NotificationType.INVITATION,
            },
        })));
        const allMembersDataWithId = yield prisma_1.default.member.findMany({
            where: {
                workspaceId: newWorkspace.id,
                recieverInvitations: {
                    some: {
                        status: "ACCEPTED",
                    },
                },
            },
        });
        const lancersDataWithId = yield prisma_1.default.member.findMany({
            where: {
                workspaceId: newWorkspace.id,
                role: { in: ["ADMIN", "LANCER"] },
                recieverInvitations: {
                    some: {
                        status: "ACCEPTED",
                    },
                },
            },
            select: {
                id: true,
            },
        });
        const clientsDataWithId = yield prisma_1.default.member.findMany({
            where: {
                workspaceId: newWorkspace.id,
                role: { in: ["ADMIN", "CLIENT"] },
                recieverInvitations: {
                    some: {
                        status: "ACCEPTED",
                    },
                },
            },
            select: {
                id: true,
            },
        });
        console.log({ allMembersDataWithId, clientsDataWithId, lancersDataWithId });
        const allChatData = allMembersDataWithId.map((memberData) => ({
            memberId: memberData.id,
            chatId: allChat.id,
        }));
        const lancersChatData = lancersDataWithId.map((memberData) => ({
            memberId: memberData.id,
            chatId: lancersAndAdminChat.id,
        }));
        const clientsChatData = clientsDataWithId.map((memberData) => ({
            memberId: memberData.id,
            chatId: clientsAndAdminChat.id,
        }));
        const finalData = allChatData.concat(lancersChatData).concat(clientsChatData);
        console.log({ finalData });
        yield prisma_1.default.$transaction([
            prisma_1.default.chatWithMember.createMany({ data: finalData }),
        ]);
        return res.status(200).json({ workspace: newWorkspace });
    });
}
exports.handleCreateWorkspace = handleCreateWorkspace;
function handleGetWorkspace(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        const members = yield prisma_1.default.member.findMany({
            where: {
                userId: userId,
                recieverInvitations: {
                    some: {
                        status: "ACCEPTED",
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                workspace: {
                    include: {
                        admin: true,
                    },
                },
            },
        });
        const membersWithTotalCount = members.map((member) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const totalCount = yield prisma_1.default.member.groupBy({
                by: ["workspaceId"],
                where: {
                    workspaceId: member.workspace.id,
                    recieverInvitations: {
                        some: {
                            status: "ACCEPTED",
                        },
                    },
                },
                _count: {
                    _all: true,
                },
            });
            return Object.assign(Object.assign({}, member), { totalMember: (_c = (_b = (_a = totalCount[0]) === null || _a === void 0 ? void 0 : _a._count) === null || _b === void 0 ? void 0 : _b._all) !== null && _c !== void 0 ? _c : 0 });
        }));
        const finalData = yield Promise.all(membersWithTotalCount);
        return res.status(200).json({ data: finalData });
    });
}
exports.handleGetWorkspace = handleGetWorkspace;
function handleDeleteWorkspace(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)(["ADMIN"], workspaceId, userId);
        const workspace = yield prisma_1.default.workspace.findUnique({
            where: { id: workspaceId },
        });
        const allMembers = yield prisma_1.default.member.findMany({
            where: {
                workspaceId,
                recieverInvitations: {
                    some: {
                        status: "ACCEPTED",
                    },
                },
            },
        });
        yield prisma_1.default.$transaction(allMembers.map((member) => prisma_1.default.notification.create({
            data: {
                senderId: userId,
                recieverId: member.userId,
                message: userId === member.userId
                    ? `You deleted the Workspace named ${workspace === null || workspace === void 0 ? void 0 : workspace.name}`
                    : `deleted the Workspace named ${workspace === null || workspace === void 0 ? void 0 : workspace.name}`,
                type: userId === member.userId
                    ? client_1.NotificationType.NORMAL
                    : client_1.NotificationType.DELETE_WORKSPACE,
            },
        })));
        const deleteWorkspace = yield prisma_1.default.workspace.delete({
            where: { id: workspaceId },
        });
        return res
            .status(200)
            .json({ message: `${deleteWorkspace.name} was deleted Successfully!!` });
    });
}
exports.handleDeleteWorkspace = handleDeleteWorkspace;
function handleUpdateWorkspaceTitle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = req.body;
        const { workspaceId, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)(["ADMIN"], workspaceId, userId);
        if (!name)
            return res.status(400).json({ message: "Updated title can't be Emtpy" });
        const allMembers = yield prisma_1.default.member.findMany({
            where: {
                workspaceId,
                recieverInvitations: {
                    some: {
                        status: "ACCEPTED",
                    },
                },
            },
        });
        const findWorkspace = yield prisma_1.default.workspace.findUnique({
            where: { id: workspaceId },
        });
        const updateWorkspace = yield prisma_1.default.workspace.update({
            data: { name },
            where: { id: workspaceId },
        });
        yield prisma_1.default.$transaction(allMembers.map((member) => prisma_1.default.notification.create({
            data: {
                senderId: userId,
                recieverId: member.userId,
                message: member.userId === userId
                    ? `You updated the title of  workspace from ${findWorkspace === null || findWorkspace === void 0 ? void 0 : findWorkspace.name} to ${updateWorkspace.name}`
                    : `The Admin of the Workspace senderName updated the title from ${findWorkspace === null || findWorkspace === void 0 ? void 0 : findWorkspace.name} to ${updateWorkspace.name}`,
                type: member.userId === userId
                    ? client_1.NotificationType.INVITATION_CREATOR
                    : client_1.NotificationType.WORKSPACE_TITLE_UPDATE,
                workspaceId: workspaceId,
            },
        })));
        return res
            .status(200)
            .json({ message: `${updateWorkspace.name} was updated Successfully!!` });
    });
}
exports.handleUpdateWorkspaceTitle = handleUpdateWorkspaceTitle;
function handleAddMembers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { addedUsers, role } = req.body;
        const { userId, workspaceId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)(["ADMIN"], workspaceId, userId);
        const addedUsersId = yield Promise.all(addedUsers === null || addedUsers === void 0 ? void 0 : addedUsers.map((userEmail) => __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.findUnique({
                where: { email: userEmail },
                select: { id: true },
            });
        })));
        const workspace = yield prisma_1.default.workspace.findUnique({
            where: { id: workspaceId },
        });
        if (!workspace)
            throw new api400Error_1.default("Workspace with the Id Provided Id was not Found");
        const newMembersData = addedUsers.map((_, index) => {
            return {
                workspaceId: workspace.id,
                userId: addedUsersId[index].id,
                role: role,
            };
        });
        const addedMembers = yield prisma_1.default.$transaction(newMembersData.map((newMemberData) => prisma_1.default.member.upsert({
            where: {
                workspaceId_userId: { workspaceId, userId: newMemberData.userId },
            },
            update: {
                role: role,
            },
            create: Object.assign({}, newMemberData),
        })));
        // const allChatId = await prisma.chat.findMany({
        //   where: { workspaceId: workspace.id, type: "ALL" },
        //   select: {
        //     id: true,
        //   },
        // });
        // const lancersChatId = await prisma.chat.findMany({
        //   where: { workspaceId: workspace.id, type: "LANCERS" },
        //   select: { id: true },
        // });
        // const clientsChatId = await prisma.chat.findMany({
        //   where: { workspaceId: workspace.id, type: "CLIENTS" },
        //   select: { id: true },
        // });
        // console.log({ addedMembers, allChatId, lancersChatId, clientsChatId });
        // await prisma.chatWithMember.createMany({
        //   data: addedMembers.map(({ id }) => ({
        //     memberId: id,
        //     chatId: allChatId[0].id as any,
        //   })),
        // });
        // await prisma.chatWithMember.createMany({
        //   data: addedMembers
        //     .filter((addedMember) => addedMember.role === Role.LANCER)
        //     .map(({ id }) => ({ memberId: id, chatId: lancersChatId[0].id as any })),
        // });
        // await prisma.chatWithMember.createMany({
        //   data: addedMembers
        //     .filter((addedMember) => addedMember.role === Role.CLIENT)
        //     .map(({ id }) => ({ memberId: id, chatId: clientsChatId[0].id as any })),
        // });
        const adminMember = yield prisma_1.default.member.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        const invitationData = yield prisma_1.default.$transaction(addedMembers.map((addedMember) => prisma_1.default.invitation.create({
            data: {
                message: `You are invited as a ${addedMember.role} in ${workspace.name}`,
                workspaceId: workspaceId,
                recieverId: addedMember.id,
                senderId: adminMember.id,
            },
            include: {
                reciever: true,
                sender: true,
            },
        })));
        yield prisma_1.default.$transaction(invitationData.map((invitation) => prisma_1.default.notification.create({
            data: {
                invitationId: invitation.id,
                message: invitation.message,
                recieverId: invitation.reciever.userId,
                senderId: invitation.sender.userId,
                type: client_1.NotificationType.INVITATION,
            },
        })));
        return res.status(200).json({
            message: `The new User with the Role ${role} added SucessFully`,
            data: addedMembers,
        });
    });
}
exports.handleAddMembers = handleAddMembers;
function checkIfEmailAvailable(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, workspaceId } = req.params;
        const findUser = yield prisma_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (!findUser) {
            throw new api400Error_1.default("User doesn't Exist ");
        }
        const isMember = yield prisma_1.default.member.findUnique({
            where: {
                workspaceId_userId: { workspaceId, userId: findUser.id },
            },
        });
        if (!isMember) {
            return res.status(200).json({ message: "Email is Allowed to Add" });
        }
        const isPartOfWorkspace = yield prisma_1.default.invitation.findFirst({
            where: {
                workspaceId: workspaceId,
                recieverId: isMember.id,
                NOT: { status: "DECLINED" },
            },
        });
        if ((isPartOfWorkspace === null || isPartOfWorkspace === void 0 ? void 0 : isPartOfWorkspace.status) === "ACCEPTED") {
            throw new api400Error_1.default("Already Part of the Workspace");
        }
        if ((isPartOfWorkspace === null || isPartOfWorkspace === void 0 ? void 0 : isPartOfWorkspace.status) === "PENDING") {
            throw new api400Error_1.default("Already Invited, Pending State");
        }
        return res.status(200).json({ message: "Email is Allowed to Add" });
    });
}
exports.checkIfEmailAvailable = checkIfEmailAvailable;
function getAllMembers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, workspaceId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)(["ADMIN"], workspaceId, userId);
        const findMembers = yield prisma_1.default.member.findMany({
            where: {
                workspaceId: workspaceId,
                NOT: { role: "ADMIN" },
                recieverInvitations: {
                    some: {
                        status: "ACCEPTED",
                    },
                },
            },
            select: {
                role: true,
                createdAt: true,
                workspaceId: true,
                userId: true,
                user: {
                    select: {
                        id: true,
                        photo: true,
                        userName: true,
                    },
                },
            },
        });
        return res.status(200).json({
            message: `Get all users in the Workspace `,
            data: findMembers,
        });
    });
}
exports.getAllMembers = getAllMembers;
function deleteMember(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId, userId, memberId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)(["ADMIN"], workspaceId, userId);
        // const existingChatIds = await prisma.chat.findMany({
        //   where: { workspaceId },
        //   select: {
        //     id: true,
        //   },
        // });
        console.log({ memberId });
        const deleteMember = yield prisma_1.default.member.delete({
            where: {
                workspaceId_userId: { workspaceId, userId: memberId },
            },
        });
        console.log({ deleteMember });
        return res.status(200).json({
            message: `The member with the role ${deleteMember.role} was SuccesFully removed `,
            data: deleteMember,
        });
    });
}
exports.deleteMember = deleteMember;
function appointAsAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId: senderId, workspaceId } = req.params;
        const { recieverId } = req.body;
        (0, checkIfUserIdMatches_1.default)(req, senderId);
        yield (0, verifyRole_1.default)(["ADMIN"], workspaceId, senderId);
        const workspace = yield prisma_1.default.workspace.findUnique({
            where: { id: workspaceId },
        });
        const notifications = yield prisma_1.default.notification.createMany({
            data: [
                {
                    senderId,
                    recieverId,
                    message: `You are apppointed as admin of the workspace ${workspace === null || workspace === void 0 ? void 0 : workspace.name}`,
                    type: "APPOINT_ADMIN",
                    workspaceId,
                },
                {
                    senderId,
                    recieverId: senderId,
                    message: `You have sent invitation to appoint (recieverName) as admin of the workspace ${workspace === null || workspace === void 0 ? void 0 : workspace.name}`,
                    type: "APPOINT_ADMIN_CREATOR",
                    workspaceId,
                },
            ],
        });
        return res.status(200).json({
            message: "Invitation is sent to appoint new Admin",
            data: notifications,
        });
    });
}
exports.appointAsAdmin = appointAsAdmin;
function handleUpdateInvitationStatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        const { invitationId, invitationStatus, notificationId } = req.body;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const updateInvitationStatus = yield prisma_1.default.invitation.update({
            data: {
                status: invitationStatus,
            },
            where: {
                id: invitationId,
            },
        });
        const workspace = yield prisma_1.default.workspace.findUnique({
            where: { id: updateInvitationStatus.workspaceId },
        });
        const member = yield prisma_1.default.member.findUnique({
            where: {
                id: updateInvitationStatus.recieverId,
            },
            include: {
                user: true,
                recieverInvitations: {
                    select: {
                        status: true,
                    },
                },
            },
        });
        if (invitationStatus === client_1.InvitationStatus.ACCEPTED) {
            const role = member === null || member === void 0 ? void 0 : member.role;
            const chats = yield prisma_1.default.chat.findMany({
                where: {
                    workspaceId: updateInvitationStatus.workspaceId,
                },
            });
            const allChatId = chats.find((chat) => chat.type == client_1.ChatType.ALL).id;
            const lancersChatId = chats.find((chat) => chat.type == client_1.ChatType.LANCERS).id;
            const clientsChatId = chats.find((chat) => chat.type == client_1.ChatType.CLIENTS).id;
            if ((member === null || member === void 0 ? void 0 : member.id) && allChatId) {
                yield prisma_1.default.chatWithMember.create({
                    data: {
                        chatId: allChatId,
                        memberId: member.id,
                    },
                });
                if (client_1.Role.LANCER === role) {
                    yield prisma_1.default.chatWithMember.create({
                        data: {
                            chatId: lancersChatId,
                            memberId: member.id,
                        },
                    });
                }
                if (client_1.Role.CLIENT === role) {
                    yield prisma_1.default.chatWithMember.create({
                        data: {
                            chatId: clientsChatId,
                            memberId: member.id,
                        },
                    });
                }
            }
            // const allChatId =
        }
        yield prisma_1.default.notification.update({
            data: {
                message: invitationStatus === client_1.InvitationStatus.ACCEPTED
                    ? `You are now member of the Workspace ${workspace === null || workspace === void 0 ? void 0 : workspace.name} `
                    : `You declined to be part of the Workspace ${workspace === null || workspace === void 0 ? void 0 : workspace.name} `,
                type: invitationStatus === client_1.InvitationStatus.ACCEPTED
                    ? client_1.NotificationType.ACCEPTED_INVITATION
                    : client_1.NotificationType.DECLINED_INVITATION,
            },
            where: {
                id: notificationId,
            },
        });
        return res.status(200).json({
            message: `You ${invitationStatus} Sucessfully`,
            data: updateInvitationStatus,
        });
    });
}
exports.handleUpdateInvitationStatus = handleUpdateInvitationStatus;
const adminInvitationRequestHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceId } = req.params;
    const { newAdminId, adminId, status, notificationId } = req.body;
    (0, checkIfUserIdMatches_1.default)(req, newAdminId);
    if (status === client_1.NotificationType.APPOINT_ADMIN_DECLINED) {
        const data = yield prisma_1.default.notification.update({
            where: {
                id: notificationId,
            },
            data: {
                type: "APPOINT_ADMIN_DECLINED",
            },
        });
        return res.status(200).json({
            message: "You declined to be part of workspace as an admin",
            data,
        });
    }
    const chatIds = yield prisma_1.default.chat.findMany({
        where: { workspaceId },
        select: { id: true, type: true },
    });
    const chatObj = {};
    chatIds.forEach((chatData) => {
        chatObj[chatData.type] = chatData.id;
    });
    const findAdminMemberId = yield prisma_1.default.member.findUnique({
        where: { workspaceId_userId: { workspaceId, userId: adminId } },
        select: {
            id: true,
        },
    });
    const findNewAppointedMemberId = yield prisma_1.default.member.findUnique({
        where: { workspaceId_userId: { workspaceId, userId: newAdminId } },
        select: {
            id: true,
            role: true,
        },
    });
    const newAdminRole = findNewAppointedMemberId.role;
    let addnewAdminChatType = [client_1.ChatType.LANCERS];
    if (newAdminRole === client_1.Role.LANCER) {
        addnewAdminChatType = [client_1.ChatType.CLIENTS];
    }
    yield prisma_1.default.$transaction([
        prisma_1.default.workspace.update({
            where: {
                id: workspaceId,
            },
            data: {
                adminId: newAdminId,
            },
        }),
        prisma_1.default.member.update({
            where: {
                workspaceId_userId: { workspaceId, userId: newAdminId },
            },
            data: {
                role: "ADMIN",
            },
        }),
        prisma_1.default.member.update({
            where: {
                workspaceId_userId: { workspaceId, userId: adminId },
            },
            data: {
                role: "CLIENT",
            },
        }),
        prisma_1.default.notification.update({
            where: {
                id: notificationId,
            },
            data: {
                type: status === client_1.NotificationType.APPOINT_ADMIN_ACCEPTED
                    ? client_1.NotificationType.APPOINT_ADMIN_ACCEPTED
                    : client_1.NotificationType.APPOINT_ADMIN_DECLINED,
            },
        }),
        prisma_1.default.chatWithMember.delete({
            where: {
                chatId_memberId: {
                    chatId: chatObj[client_1.ChatType.LANCERS],
                    memberId: findAdminMemberId.id,
                },
            },
        }),
        prisma_1.default.chatWithMember.create({
            data: {
                chatId: chatObj[addnewAdminChatType[0]],
                memberId: findNewAppointedMemberId.id,
            },
        }),
    ]);
    // await prisma.chat.findMany({ where: { workspaceId: workspaceId } });
    return res.status(200).json({ message: "You are appointed as a new admin" });
});
exports.adminInvitationRequestHandler = adminInvitationRequestHandler;
