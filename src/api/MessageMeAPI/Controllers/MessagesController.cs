using MessageMeAPI.Daos;
using MessageMeAPI.Helpers;
using MessageMeAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MessageMeAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class MessagesController : Controller
    {
        private DAOBase<Messages> daoMessages = new DAOBase<Messages>();
        private DAOBase<Users> daoUsers = new DAOBase<Users>();

        [HttpGet]
        public APIResponse Get()
        {
            APIResponse response = new APIResponse();
            List<Messages> messagesList = new List<Messages>();
            messagesList = daoMessages.GetAll().OrderByDescending(o => o.timestamp).ToList();
            foreach(Messages message in messagesList)
            {
                message.user = daoUsers.GetById(message.user_id);
            }
            response.success = messagesList.Count > 0;
            response.data = messagesList;
            return response;
        }

        [HttpPost]
        [Route("{id}/read")]
        public APIResponse UpdateMessage(long id)
        {
            APIResponse response = new APIResponse();
            Messages message = daoMessages.GetById(id);
            if (message == null)
            {
                response.success = false;
                response.error = "Message not found";
            }
            else
            {
                message.read = true;
                message.read_at = Utils.DateNow(DateTime.Now);
                daoMessages.Update(message);
                response.success = true;
            }
            return response;
        }
    }
}
