"use server";

import { auth } from "@/auth"; // Assuming auth setup is here based on project structure
import { prisma } from "@/lib/prisma";
import { inviteCollaborator } from "@/lib/github";
import { revalidatePath } from "next/cache";

/**
 * Grants access to a product's GitHub repository.
 * @param productId The ID of the product.
 * @param githubUsername The GitHub username of the user.
 */
export async function grantRepoAccess(productId: string, githubUsername: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    // 1. Verify connection: User must have purchased the product
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
      include: {
        product: true,
      },
    });

    if (!purchase || !purchase.product) {
      return { error: "Purchase not found" };
    }

    const repo = purchase.product.githubRepo;
    if (!repo) {
      return { error: "This product does not have an associated GitHub repository." };
    }

    // 2. Update User's GitHub Username if changed/new
    // We update the User model so it persists for future purchases
    if (githubUsername && githubUsername !== session.user.githubUsername) {
        await prisma.user.update({
            where: { id: userId },
            data: { githubUsername: githubUsername }
        })
    }
    
    // 3. Invite Collaborator
    await inviteCollaborator(repo, githubUsername);

    revalidatePath("/my-products"); // or wherever the user sees this
    return { success: true, message: `Invitation sent to ${githubUsername}. Check your email or GitHub notifications.` };

  } catch (error: any) {
    console.error("Grant Access Error:", error);
    return { error: error.message || "Something went wrong" };
  }
}
