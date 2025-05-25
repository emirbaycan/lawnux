 function compressImage(maxWidth, maxHeight, cimage, imgType, maxSize, fillStyle, compression, orientation, originalSize, speed, logo) {
     // Her satırda var yazmamak için fonksiyon boyunca var olan değişkenleri tanımlıyoruz
     var owidth, oheight, width, height, canvas, ctx;
     // Resimin genişliğini ve yüksekliğini alıyoruz
     width = cimage.width;
     height = cimage.height;
     // Boyutların sınırdan büyük olması durumunda boyutu ayarladığımız kısım

     if (width > maxWidth) {
         1920 * 2440 / 3440;
         height = Math.round(maxWidth * height / width);
         width = maxWidth;
     }

     // Sıkıştırma hesaplama algoritması olmadığı için ve en iyi sıkıştırmanın tekte yapıldığı için sıkıştırmayı istenilen boyuta gelene kadar hesaplıyoruz 
     // Ardından işlemi yapıp sonucu veriyoruz
     while (true) {
         // Sıkıştırma yapabilmek için resimi çizeceğimiz canvas alanını oluşturuyoruz
         canvas = document.createElement("canvas");
         ctx = canvas.getContext("2d");
         // Oryantasyon resimin exif bilgisinde bulunan bir bilgidir. Bu bilgi resimin döndürülmesi gerektiğine işaret edebilir.
         // Bunu kontrol ediyor ve oryantasyon bilgisine göre resmi döndürerek kullanıcının gördüğü biçimde çizilmesini sağlıyoruz.
         if (orientation > 0) {

             if ([5, 6, 7, 8].indexOf(orientation) > -1) {
                 canvas.width = height;
                 canvas.height = width;
             } else {
                 canvas.width = width;
                 canvas.height = height;
             }
             switch (orientation) {
                 case 2:
                     ctx.transform(-1, 0, 0, 1, width, 0);
                     break;
                 case 3:
                     ctx.transform(-1, 0, 0, -1, width, height);
                     break;
                 case 4:
                     ctx.transform(1, 0, 0, -1, 0, height);
                     break;
                 case 5:
                     ctx.transform(0, 1, 1, 0, 0, 0);
                     break;
                 case 6:
                     ctx.transform(0, 1, -1, 0, height, 0);
                     break;
                 case 7:
                     ctx.transform(0, -1, -1, 0, height, width);
                     break;
                 case 8:
                     ctx.transform(0, -1, 1, 0, 0, width);
                     break;
                 default:
                     break;
             }

         } else {
             canvas.width = width;
             canvas.height = height;
         }
         // Kağıdın varsayılan olarak siyah olacağı için transparan kısmını istediğimiz renk ile dolduruyoruz.         

         ctx.fillStyle = "rgba(0, 0, 0, 0)";
         ctx.fillRect(0, 0, width, height);

         // Resimi canvasa çiziyoruz
         ctx.drawImage(cimage, 0, 0, width, height);
         if (logo != undefined) {
             ctx.font = "600 30px Arial"
             ctx.textAlign = "center";
             ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
             ctx.fillText(logo, width / 2, height / 2);
         }
         // Canvasa çizilmiş resmi dataURL ye çeviriyoruz
         res = canvas.toDataURL(imgType, compression);
         // Boyutun resim indirildiğinde milim de olsa farklılık gösterebilmesinden dolayı boyutu daha yüksekten kontrol ediyoruz 
         size = res.length * 7 / 8;
         // Boyut maximum boyuttan küçük ve resmin orjinal boyutundan küçük ise program sonucu veriyor aksi halde sıkıştırma devam ediyor
         if (size < maxSize && size < originalSize) {
             return res;
         } else {
             // Resmin kalitesini her sonuca ulaşmamış çıktı da düşürüyoruz
             compression = compression - speed;
             // Sıkıştırmanın 1920 x 1080 sınırlarında 0 a gelemediğini mbı 1 gb a kadar ulaşan resimlerde test ettim, sonrasında da aynı olacağını düşünüyorum
             if (compression <= 0) {
                 return res;
             }
         }
     }
 }
 // Resmin oryantasyon bilgisini almak için bir kod bunu biryerden aldım öneöli birşey içermiyor gibi ve optimize yazılmış
 // Resimde oryantasyon yok ise -1 ve -2 çıktısı, var ise 1-8 arasında bir sayı veriyor
 function getOrientation(file, filename, callback) {
     var nreader = new FileReader();
     nreader.onload = function(event) {
         var view = new DataView(event.target.result);
         if (view.getUint16(0, false) != 0xFFD8) return callback(-2, filename);
         var length = view.byteLength,
             offset = 2;
         while (offset < length) {
             var marker = view.getUint16(offset, false);
             offset += 2;
             if (marker == 0xFFE1) {
                 if (view.getUint32(offset += 2, false) != 0x45786966) {
                     return callback(-1, filename);
                 }
                 var little = view.getUint16(offset += 6, false) == 0x4949;
                 offset += view.getUint32(offset + 4, little);
                 var tags = view.getUint16(offset, little);
                 offset += 2;
                 for (var i = 0; i < tags; i++)
                     if (view.getUint16(offset + (i * 12), little) == 0x0112)
                         return callback(view.getUint16(offset + (i * 12) + 8, little), filename);
             } else if ((marker & 0xFF00) != 0xFF00) break;
             else offset += view.getUint16(offset, false);
         }
         return callback(-1, filename);
     };
     nreader.readAsArrayBuffer(file.slice(0, 64 * 1024));
 }
 // Resimlerin blob olarak asp.net sunucusunda kabul edilmemesi üzerine bu fonksiyonu kullanmammız gerekti
 // Blob kabul etmeyi düşünürseniz internette dataURI to blob şeklinde arayarak bulabilirsiniz.
 function srcToFile(src, fileName, mimeType, rfilename) {
     return (fetch(src)
         .then(function(res) { return res.arrayBuffer(); })
         .then(function(buf) { return new File([buf], rfilename, { type: mimeType }, ); })
     );
 }

 function compress(file, filename, logo, callback) {
     if (typeof FileReader !== "undefined") {
         var reader = new FileReader();
         reader.onload = function(e) {
             var src = e.target.result;
             var orientation;
             // Bu haliyle resmin maximum boyutu 1 MB olacaktır daha fazla MB için maxSize'ın sonuna *3 veya
             // Daha az kilobyte için * 0.2 (yaklaşık 200 KB) şeklinde istediğiniz boyuta ayarlayabilirsiniz.
             var maxSize = 1048576 * 1;
             // Sıkıştırılmak için gereken resmin minimum boyutu yaklaşık 200 KB olacaktır değeri değiştirebilirsiniz. 
             var minSize = 1048576 * 0.2;
             // Resmin maximum genişliği ve maximum yüksekliği buradan belirlenebilir, limit olmaması için boş bırakabilirsiniz.             
             var maxWidth = 1920;
             var maxHeight = 1080;
             // PNG uzantılı resimlerde transparan kısmın rengini buradan belirleyebilirsiniz.
             var fillStyle = '#fff';
             var image = new Image();
             var originalSize = file.size;
             // Sıkıştırmaya başlama miktarını 0 ile 1 arasında belirleyebilirsiniz: hızı ve kaliteyi etkileyecektir.
             var compression = 0.9;
             // Sıkıştırılmanın maxSize'a ulaşana kadar arttırılan miktarıdır. hızı ve kaliteyi etkileyecektir.
             // 0 ile compression değeri arasında bir değer girilmelidir.
             var speed = 0.1;

             getOrientation(file, filename, function(orientation, filename) {

                 // minSize olarak belirlenen değerin altındaki değerlerde minimum sıkıştırma yapılması için
                 if (originalSize > minSize) {
                     imgType = 'image/jpeg';
                 } else {
                     imgType = file.type;
                 }
                 image.onload = function() {
                     //Resim ilk olarak dataURI formatında gelmektedir
                     src = compressImage(maxWidth, maxHeight, image, imgType, maxSize, fillStyle, compression, orientation, originalSize, speed, logo);
                     //Resim dosyasını sayfada buradaki src ile görüntüleyebilirsiniz base64 formatındadır                   
                     //Resmin sunucu tarafından okunabilmesi için dosyaya dönüştüyoruz
                     srcToFile(
                             src,
                             'image.' + imgType.split('/')[1],
                             imgType,
                             filename
                         )
                         .then(function(file) {
                             //sonucu dm-uploader'a iletiyoruz
                             callback(file, file.name);
                         });
                 }.bind(null, filename)
                 image.src = src;
             });
         }
         reader.readAsDataURL(file);
     }
 }