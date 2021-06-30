using Mafmax.RollingRetention.App.Context.DTOs;
using Mafmax.RollingRetention.App.Context.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mafmax.RollingRetention.App.Repositories
{
    public interface IUsersRetentionRepository
    {
        IEnumerable<UserRetentionDto> GetUsersRetention();
        void SaveUserRetention(IEnumerable<UserRetentionDto> users);
    }
}
