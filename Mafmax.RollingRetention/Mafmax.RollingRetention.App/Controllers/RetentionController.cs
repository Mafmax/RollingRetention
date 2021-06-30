using Mafmax.RollingRetention.App.Context.DTOs;
using Mafmax.RollingRetention.App.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Mafmax.RollingRetention.App.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RetentionController : ControllerBase
    {
        private readonly ILogger<RetentionController> logger;
        private readonly IRetentionsService retentionService;

        public RetentionController(ILogger<RetentionController> logger, IRetentionsService retentionService)
        {
            this.logger = logger;
            this.retentionService = retentionService;
        }
        [HttpGet]
        public IEnumerable<UserRetentionDto> Get()
        {

            var a = retentionService.GetUsersRetention().ToArray();
            return a;
        }
        
        [HttpPost("add")]
        public void PostTest([FromBody] UserRetentionDto[] users)
        {
            retentionService.SaveUserRetention(users);
        }

    }
}
