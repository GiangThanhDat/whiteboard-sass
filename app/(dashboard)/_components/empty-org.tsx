import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CreateOrganization } from "@clerk/nextjs"
import { Empty } from "../../../components/empty"

export function EmptyOrg() {
  return (
    <Empty
      src="/elements.jpg"
      header="Welcome to board"
      alt="empty organization"
      description="create an organization to get started"
    >
      <div className="mt-6">
        <Dialog>
          <DialogTrigger>
            <Button size="lg">Create an organization</Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
            <CreateOrganization />
          </DialogContent>
        </Dialog>
      </div>
    </Empty>
  )
}
