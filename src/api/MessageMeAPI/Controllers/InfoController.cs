using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MessageMeAPI.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace MessageMeAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class InfoController : Controller
    {
        [HttpGet]
        public APIResponse Get()
        {
            APIResponse response = new APIResponse();
            response.success = true;
            response.data = new { description = "MesasgeMe API", version = Utils.getVersion() };
            return response;
        }
    }
}
