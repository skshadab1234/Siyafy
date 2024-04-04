export const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};

export const getUndefinedFields = (obj: any, fieldsToExclude: string[] = []): string[] => {
    const undefinedFields: string[] = [];
    Object.keys(obj).forEach((key) => {
        // Check if the current key is not in the list of fields to exclude.
        if (!fieldsToExclude.includes(key)) {
            // Check if the value associated with the key is undefined.
            if (obj[key] === undefined) {
                // If the value is undefined, and the key is not in the exclude list, add the key to the result array.
                undefinedFields.push(key);
            }
        }
    });
    return undefinedFields;
};

export const ProductCard = ({ product, manageEdit }: any) => {
    const { name, images, price, id } = product;

    // Check if images array is not empty
    const imageUrl = images.length > 0 ? images[0] : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMZvHd_KZlVgD1FtA0d4YQOqfohOJbeLv3R3ZlTsPW8w&s'; // Replace 'placeholder.jpg' with your default image path

    return (
        <div className="group cursor-pointer">
            <div className="aspect-h-1 aspect-w-1 xl:aspect-h-8 xl:aspect-w-7 w-full overflow-hidden rounded-lg bg-gray-200">
                <img src={imageUrl} alt={name} className="h-full w-full object-cover object-center group-hover:opacity-75" />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{name}</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">${price}</p>
            <div onClick={() => manageEdit(product)}>Edit</div>
        </div>
    );
};
