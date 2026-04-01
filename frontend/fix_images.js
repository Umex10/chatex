const fs = require('fs');

// Fix ShoutInstance Blur & Loading Spinner
const siPath = '/home/umejr/IdeaProjects/chatex/frontend/src/components/shout/ShoutInstance.tsx';
let si = fs.readFileSync(siPath, 'utf8');

// 1. Add imageLoading state
if (!si.includes('imageLoading')) {
  si = si.replace('const [open, setOpen] = useState(false);', 'const [open, setOpen] = useState(false);\n  const [imageLoading, setImageLoading] = useState(true);');
}

// 2. Adjust handleImage to reset loading state
si = si.replace(
  '  function handleImage(e: React.MouseEvent<HTMLDivElement>, imgUrl: string) {\n    setImageUrl(imgUrl);\n    setOpen(true);\n    e.stopPropagation();\n  }',
  '  function handleImage(e: React.MouseEvent<HTMLDivElement>, imgUrl: string) {\n    setImageUrl(imgUrl);\n    setImageLoading(true);\n    setOpen(true);\n    e.stopPropagation();\n  }'
);

// 3. Fix sizes="300px" to sizes="(max-width: 768px) 100vw, 50vw" to avoid blurriness!
si = si.replace(/sizes="300px"/g, 'sizes="(max-width: 768px) 100vw, 50vw"');

// 4. Add spinner to DialogContent for image viewing
const oldDialogContent = `<CldImage fill src={imageUrl} alt="Post image 1" crop="fill" format="auto" quality="auto" sizes="95vw" className="object-cover h-full"
                        placeholder="blur"
                        blurDataURL={\`https://res.cloudinary.com/\${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/\${imageUrl}\`} />`;

const newDialogContent = `<CldImage fill src={imageUrl} alt="Post image 1" crop="fill" format="auto" quality="auto" sizes="95vw" className={\`object-contain w-full h-full transition-opacity duration-300 \${imageLoading ? 'opacity-0' : 'opacity-100'}\`}
                        onLoad={() => setImageLoading(false)}
                        placeholder="blur"
                        blurDataURL={\`https://res.cloudinary.com/\${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/\${imageUrl}\`} />
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Spinner />
                        </div>
                      )}`;

if (si.includes(oldDialogContent)) {
  si = si.replace(oldDialogContent, newDialogContent);
}

// Fix object-cover to object-contain so we see the full image, but user original code was object-cover h-full
// object-contain is usually better for a modal view so it doesn't crop the large image!

fs.writeFileSync(siPath, si);

// Fix CreateShout blurriness & loading 
const csPath = '/home/umejr/IdeaProjects/chatex/frontend/src/components/shout/CreateShout.tsx';
let cs = fs.readFileSync(csPath, 'utf8');
// Fix boolean expression precedence
cs = cs.replace(
  'isLoadingShout || isLoadingComment || form.formState.isSubmitting &&',
  '(isLoadingShout || isLoadingComment || form.formState.isSubmitting) &&'
);

// Replace next/image preview with unoptimized to prevent blur
cs = cs.replace(
  '<Image src={preview} alt={`Preview ${i + 1}`} width={80} height={80} className="w-20 h-20 object-cover rounded-md" />',
  '<Image src={preview} alt={`Preview ${i + 1}`} width={80} height={80} unoptimized className="w-20 h-20 object-cover rounded-md border" />'
);

fs.writeFileSync(csPath, cs);
