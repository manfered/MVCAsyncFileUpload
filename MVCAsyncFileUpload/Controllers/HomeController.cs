using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVCAsyncFileUpload.Controllers
{
    public class HomeController : Controller
    {
        //set the desired upload directory
        public string StorageDirectory = "UploadedFiles";

        public ActionResult Index()
        {
            return View();
        }
        
        public ActionResult Contact()
        {
            ViewBag.Message = "Farzad(Fred) Seifi";

            return View();
        }

        public ActionResult AsyncUpload()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AsyncUpload(IEnumerable<HttpPostedFileBase> files)
        {
            int count = 0;
            string FileName = string.Empty;
            if (files != null)
            {
                foreach (var file in files)
                {
                    if (file != null && file.ContentLength > 0)
                    {
                        FileName = file.FileName;
                        //var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                        var path = Path.Combine(Server.MapPath("~/" + StorageDirectory), FileName);

                        //if file exists we assign a new sequence of charachters at the enf of file name
                        if (System.IO.File.Exists(path))
                        {
                            FileName = Path.GetFileNameWithoutExtension(file.FileName) + "_" + Guid.NewGuid() + Path.GetExtension(file.FileName);
                            path = Path.Combine(Server.MapPath("~/" + StorageDirectory), FileName);
                        }
                        file.SaveAs(path);
                        count++;
                    }
                }
            }

            //return new JsonResult { Data = "../UploadedFiles/" + FileName };
            //return new JsonResult { Data = "Successfully " + count + " file(s) uploaded" };
            return Json(new { Data = "Successfully " + count + " file(s) uploaded", src = "../" + StorageDirectory + "/" + FileName, fileName = FileName }, JsonRequestBehavior.AllowGet);
        }


        public ActionResult AsyncDelete()
        {
            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AsyncDelete(string deletFileName)
        {
            string fullPath = Path.Combine(Server.MapPath("~/" + StorageDirectory), deletFileName);
            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
            }

            var count = 1;


            return Json(new { Data = "Successfully " + count + " file(s) deleted", deleteFileName = deletFileName }, JsonRequestBehavior.AllowGet);
            //return new JsonResult { Data = "Successfully " + count + " file(s) uploaded" };
        }
    }
}