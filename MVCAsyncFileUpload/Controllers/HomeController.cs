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
            string resultStr = string.Empty;
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

                        try
                        {
                            file.SaveAs(path);
                            count++;
                            resultStr = "Successfully " + count + " file(s) uploaded";
                        }
                        catch (Exception ex)
                        {
                            //exception message
                            resultStr = ex.Message;
                        }

                    }
                }
            }

            //return new JsonResult { Data = "../UploadedFiles/" + FileName };
            //return new JsonResult { Data = "Successfully " + count + " file(s) uploaded" };
            return Json(new { Data = resultStr, src = "../" + StorageDirectory + "/" + FileName, fileName = FileName }, JsonRequestBehavior.AllowGet);
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
            string resultStr = string.Empty;
            if (System.IO.File.Exists(fullPath))
            {
                try
                {
                    System.IO.File.Delete(fullPath);
                    resultStr = "Successfully 1 file deleted";
                }
                catch (Exception ex)
                {
                    resultStr = ex.Message;
                }
                
            }
                        
            return Json(new { Data = resultStr, deleteFileName = deletFileName }, JsonRequestBehavior.AllowGet);
            //return new JsonResult { Data = "Successfully " + count + " file(s) uploaded" };
        }
    }
}